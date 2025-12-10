// Settlements Routes

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { calculateSettlement, convertCurrency, getExchangeRates } from '../utils/exchange';
import type { Env, Settlement, APIResponse, JWTPayload } from '../types';

const settlements = new Hono<{ Bindings: Env; Variables: { user: JWTPayload } }>();

// Get all settlements (with pagination and filters)
settlements.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const status = c.req.query('status');
    const startDate = c.req.query('start_date');
    const endDate = c.req.query('end_date');
    
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM settlements WHERE 1=1';
    const params: any[] = [];
    
    // If not admin, only show user's settlements
    if (user.role !== 'admin') {
      query += ' AND user_id = ?';
      params.push(user.userId);
    }
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (startDate) {
      query += ' AND settlement_date >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND settlement_date <= ?';
      params.push(endDate);
    }
    
    query += ' ORDER BY settlement_date DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const { results } = await c.env.DB.prepare(query).bind(...params).all<Settlement>();
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM settlements WHERE 1=1';
    const countParams: any[] = [];
    
    if (user.role !== 'admin') {
      countQuery += ' AND user_id = ?';
      countParams.push(user.userId);
    }
    
    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    
    if (startDate) {
      countQuery += ' AND settlement_date >= ?';
      countParams.push(startDate);
    }
    
    if (endDate) {
      countQuery += ' AND settlement_date <= ?';
      countParams.push(endDate);
    }
    
    const countResult = await c.env.DB.prepare(countQuery).bind(...countParams).first<{ total: number }>();
    const total = countResult?.total || 0;
    
    return c.json<APIResponse>({
      success: true,
      data: {
        settlements: results,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get settlements error:', error);
    return c.json<APIResponse>({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

// Get settlement summary
settlements.get('/summary', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const startDate = c.req.query('start_date');
    const endDate = c.req.query('end_date');
    
    let query = `
      SELECT 
        COUNT(*) as total_settlements,
        SUM(CASE WHEN status = 'completed' THEN net_amount ELSE 0 END) as total_paid,
        SUM(CASE WHEN status = 'pending' THEN net_amount ELSE 0 END) as total_pending,
        AVG(net_amount) as avg_settlement
      FROM settlements WHERE 1=1
    `;
    const params: any[] = [];
    
    // If not admin, only show user's summary
    if (user.role !== 'admin') {
      query += ' AND user_id = ?';
      params.push(user.userId);
    }
    
    if (startDate) {
      query += ' AND settlement_date >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND settlement_date <= ?';
      params.push(endDate);
    }
    
    const summary = await c.env.DB.prepare(query).bind(...params).first();
    
    return c.json<APIResponse>({
      success: true,
      data: summary
    });
    
  } catch (error) {
    console.error('Get settlement summary error:', error);
    return c.json<APIResponse>({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

// Create settlement from order (authenticated, admin only for now)
settlements.post('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const { order_id, settlement_date, platform_fee_rate, shipping_fee, transaction_fee_rate } = await c.req.json();
    
    if (!order_id) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'order_id is required' 
      }, 400);
    }
    
    // Get order details
    const order = await c.env.DB.prepare(
      'SELECT * FROM orders WHERE id = ?'
    ).bind(order_id).first<any>();
    
    if (!order) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Order not found' 
      }, 404);
    }
    
    // Check if settlement already exists for this order
    const existing = await c.env.DB.prepare(
      'SELECT id FROM settlements WHERE order_id = ?'
    ).bind(order_id).first();
    
    if (existing) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Settlement already exists for this order' 
      }, 400);
    }
    
    // Calculate settlement
    const settlement = calculateSettlement(
      order.total_amount,
      platform_fee_rate || 0.15,
      shipping_fee || 0,
      transaction_fee_rate || 0.03
    );
    
    // Get exchange rate to convert to KRW if needed
    let exchange_rate = 1;
    let net_amount_krw = settlement.netAmount;
    
    if (order.currency !== 'KRW') {
      net_amount_krw = await convertCurrency(settlement.netAmount, order.currency, 'KRW');
      exchange_rate = net_amount_krw / settlement.netAmount;
    }
    
    // Insert settlement
    const result = await c.env.DB.prepare(`
      INSERT INTO settlements (
        user_id, order_id, settlement_date,
        product_revenue, platform_fee, shipping_fee, transaction_fee,
        exchange_rate, net_amount, currency, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      order.user_id,
      order_id,
      settlement_date || new Date().toISOString().split('T')[0],
      settlement.productRevenue,
      settlement.platformFee,
      settlement.shippingFee,
      settlement.transactionFee,
      exchange_rate,
      net_amount_krw,
      'KRW',
      'pending'
    ).run();
    
    if (!result.success) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Failed to create settlement' 
      }, 500);
    }
    
    return c.json<APIResponse>({
      success: true,
      data: { 
        settlementId: result.meta.last_row_id,
        ...settlement,
        net_amount_krw,
        exchange_rate
      },
      message: 'Settlement created successfully'
    }, 201);
    
  } catch (error) {
    console.error('Create settlement error:', error);
    return c.json<APIResponse>({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

// Get exchange rates
settlements.get('/exchange-rates', async (c) => {
  try {
    const base = c.req.query('base') || 'KRW';
    const rates = await getExchangeRates(base);
    
    return c.json<APIResponse>({
      success: true,
      data: { base, rates }
    });
    
  } catch (error) {
    console.error('Get exchange rates error:', error);
    return c.json<APIResponse>({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

export default settlements;
