// Orders Routes

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { calculateSettlement, convertCurrency } from '../utils/exchange';
import type { Env, Order, APIResponse, JWTPayload } from '../types';

const orders = new Hono<{ Bindings: Env; Variables: { user: JWTPayload } }>();

// Get all orders (with pagination and filters)
orders.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const status = c.req.query('status');
    const platform = c.req.query('platform');
    
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params: any[] = [];
    
    // If not admin, only show user's orders
    if (user.role !== 'admin') {
      query += ' AND user_id = ?';
      params.push(user.userId);
    }
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (platform) {
      query += ' AND platform_name = ?';
      params.push(platform);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const { results } = await c.env.DB.prepare(query).bind(...params).all<Order>();
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM orders WHERE 1=1';
    const countParams: any[] = [];
    
    if (user.role !== 'admin') {
      countQuery += ' AND user_id = ?';
      countParams.push(user.userId);
    }
    
    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    
    if (platform) {
      countQuery += ' AND platform_name = ?';
      countParams.push(platform);
    }
    
    const countResult = await c.env.DB.prepare(countQuery).bind(...countParams).first<{ total: number }>();
    const total = countResult?.total || 0;
    
    return c.json<APIResponse>({
      success: true,
      data: {
        orders: results,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get orders error:', error);
    return c.json<APIResponse>({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

// Get single order
orders.get('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const id = c.req.param('id');
    
    let query = 'SELECT * FROM orders WHERE id = ?';
    const params: any[] = [id];
    
    // If not admin, check ownership
    if (user.role !== 'admin') {
      query += ' AND user_id = ?';
      params.push(user.userId);
    }
    
    const order = await c.env.DB.prepare(query).bind(...params).first<Order>();
    
    if (!order) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Order not found' 
      }, 404);
    }
    
    // Get product details
    const product = await c.env.DB.prepare(
      'SELECT id, name_ko, name_en, category FROM products WHERE id = ?'
    ).bind(order.product_id).first();
    
    return c.json<APIResponse>({
      success: true,
      data: {
        ...order,
        product
      }
    });
    
  } catch (error) {
    console.error('Get order error:', error);
    return c.json<APIResponse>({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

// Create new order (authenticated)
orders.post('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    
    const {
      product_id,
      platform_name,
      platform_order_id,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_country,
      quantity,
      unit_price,
      total_amount,
      currency
    } = body;
    
    if (!product_id || !platform_name || !customer_name || !shipping_address || !shipping_country || !quantity || !unit_price || !total_amount || !currency) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Missing required fields' 
      }, 400);
    }
    
    // Generate order number
    const timestamp = Date.now();
    const order_number = `ORD-${timestamp}-${Math.floor(Math.random() * 1000)}`;
    
    // Insert order
    const result = await c.env.DB.prepare(`
      INSERT INTO orders (
        order_number, product_id, user_id, platform_name, platform_order_id,
        customer_name, customer_email, customer_phone,
        shipping_address, shipping_country,
        quantity, unit_price, total_amount, currency,
        status, payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      order_number,
      product_id,
      user.userId,
      platform_name,
      platform_order_id || null,
      customer_name,
      customer_email || null,
      customer_phone || null,
      shipping_address,
      shipping_country,
      quantity,
      unit_price,
      total_amount,
      currency,
      'pending',
      'pending'
    ).run();
    
    if (!result.success) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Failed to create order' 
      }, 500);
    }
    
    return c.json<APIResponse>({
      success: true,
      data: { 
        orderId: result.meta.last_row_id,
        order_number
      },
      message: 'Order created successfully'
    }, 201);
    
  } catch (error) {
    console.error('Create order error:', error);
    return c.json<APIResponse>({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

// Update order status (authenticated)
orders.patch('/:id/status', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const id = c.req.param('id');
    const { status, payment_status, tracking_number, notes } = await c.req.json();
    
    // Check if order exists
    let query = 'SELECT user_id FROM orders WHERE id = ?';
    const params: any[] = [id];
    
    if (user.role !== 'admin') {
      query += ' AND user_id = ?';
      params.push(user.userId);
    }
    
    const existing = await c.env.DB.prepare(query).bind(...params).first<{ user_id: number }>();
    
    if (!existing) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Order not found' 
      }, 404);
    }
    
    // Build update query
    const updates: string[] = [];
    const updateParams: any[] = [];
    
    if (status) {
      updates.push('status = ?');
      updateParams.push(status);
    }
    
    if (payment_status) {
      updates.push('payment_status = ?');
      updateParams.push(payment_status);
    }
    
    if (tracking_number) {
      updates.push('tracking_number = ?');
      updateParams.push(tracking_number);
    }
    
    if (notes) {
      updates.push('notes = ?');
      updateParams.push(notes);
    }
    
    if (updates.length === 0) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'No fields to update' 
      }, 400);
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    updateParams.push(id);
    
    const updateQuery = `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`;
    const result = await c.env.DB.prepare(updateQuery).bind(...updateParams).run();
    
    if (!result.success) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Failed to update order' 
      }, 500);
    }
    
    return c.json<APIResponse>({
      success: true,
      message: 'Order updated successfully'
    });
    
  } catch (error) {
    console.error('Update order error:', error);
    return c.json<APIResponse>({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

export default orders;
