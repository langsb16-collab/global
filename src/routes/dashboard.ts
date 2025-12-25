import { Hono } from 'hono'
import type { Env } from '../types'

const dashboard = new Hono<{ Bindings: Env }>()

// 대시보드 통계 데이터
dashboard.get('/stats', async (c) => {
  try {
    const db = c.env.DB
    const userId = c.req.query('userId')
    
    if (!userId) {
      return c.json({ error: 'User ID required' }, 400)
    }

    // 총 상품 수
    const totalProducts = await db.prepare(`
      SELECT COUNT(*) as count FROM products WHERE user_id = ?
    `).bind(userId).first()

    // 승인된 상품 수
    const approvedProducts = await db.prepare(`
      SELECT COUNT(*) as count FROM products 
      WHERE user_id = ? AND status = 'approved'
    `).bind(userId).first()

    // 총 주문 수
    const totalOrders = await db.prepare(`
      SELECT COUNT(*) as count FROM orders WHERE user_id = ?
    `).bind(userId).first()

    // 진행중 주문 수
    const activeOrders = await db.prepare(`
      SELECT COUNT(*) as count FROM orders 
      WHERE user_id = ? AND status IN ('pending', 'confirmed', 'processing', 'shipped')
    `).bind(userId).first()

    // 이번 달 매출
    const currentMonth = new Date().toISOString().slice(0, 7)
    const monthlyRevenue = await db.prepare(`
      SELECT COALESCE(SUM(total_amount), 0) as revenue 
      FROM orders 
      WHERE user_id = ? 
        AND strftime('%Y-%m', created_at) = ?
        AND status NOT IN ('cancelled', 'refunded')
    `).bind(userId, currentMonth).first()

    // 총 정산 대기 금액
    const pendingSettlement = await db.prepare(`
      SELECT COALESCE(SUM(net_amount), 0) as amount 
      FROM settlements 
      WHERE user_id = ? AND status = 'pending'
    `).bind(userId).first()

    // 재고 부족 상품 수 (10개 이하)
    const lowStockProducts = await db.prepare(`
      SELECT COUNT(*) as count FROM products 
      WHERE user_id = ? AND stock_quantity <= 10 AND stock_quantity > 0
    `).bind(userId).first()

    // 재고 소진 상품 수
    const outOfStockProducts = await db.prepare(`
      SELECT COUNT(*) as count FROM products 
      WHERE user_id = ? AND stock_quantity = 0
    `).bind(userId).first()

    return c.json({
      success: true,
      stats: {
        products: {
          total: totalProducts.count,
          approved: approvedProducts.count,
          lowStock: lowStockProducts.count,
          outOfStock: outOfStockProducts.count
        },
        orders: {
          total: totalOrders.count,
          active: activeOrders.count
        },
        revenue: {
          monthly: monthlyRevenue.revenue,
          pendingSettlement: pendingSettlement.amount
        }
      }
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return c.json({ error: 'Failed to fetch dashboard stats' }, 500)
  }
})

// 월별 매출 통계 (최근 6개월)
dashboard.get('/revenue-chart', async (c) => {
  try {
    const db = c.env.DB
    const userId = c.req.query('userId')
    
    if (!userId) {
      return c.json({ error: 'User ID required' }, 400)
    }

    const { results } = await db.prepare(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as order_count,
        SUM(total_amount) as revenue
      FROM orders
      WHERE user_id = ? 
        AND status NOT IN ('cancelled', 'refunded')
        AND created_at >= date('now', '-6 months')
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month ASC
    `).bind(userId).all()

    return c.json({
      success: true,
      data: results
    })
  } catch (error) {
    console.error('Revenue chart error:', error)
    return c.json({ error: 'Failed to fetch revenue chart data' }, 500)
  }
})

// 카테고리별 판매 통계
dashboard.get('/category-sales', async (c) => {
  try {
    const db = c.env.DB
    const userId = c.req.query('userId')
    
    if (!userId) {
      return c.json({ error: 'User ID required' }, 400)
    }

    const { results } = await db.prepare(`
      SELECT 
        p.category,
        COUNT(o.id) as order_count,
        SUM(o.total_amount) as revenue,
        SUM(o.quantity) as units_sold
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE p.user_id = ? 
        AND o.status NOT IN ('cancelled', 'refunded')
      GROUP BY p.category
      ORDER BY revenue DESC
    `).bind(userId).all()

    return c.json({
      success: true,
      data: results
    })
  } catch (error) {
    console.error('Category sales error:', error)
    return c.json({ error: 'Failed to fetch category sales data' }, 500)
  }
})

// 플랫폼별 판매 통계
dashboard.get('/platform-sales', async (c) => {
  try {
    const db = c.env.DB
    const userId = c.req.query('userId')
    
    if (!userId) {
      return c.json({ error: 'User ID required' }, 400)
    }

    const { results } = await db.prepare(`
      SELECT 
        platform_name,
        COUNT(*) as order_count,
        SUM(total_amount) as revenue
      FROM orders
      WHERE user_id = ? 
        AND status NOT IN ('cancelled', 'refunded')
      GROUP BY platform_name
      ORDER BY revenue DESC
    `).bind(userId).all()

    return c.json({
      success: true,
      data: results
    })
  } catch (error) {
    console.error('Platform sales error:', error)
    return c.json({ error: 'Failed to fetch platform sales data' }, 500)
  }
})

// 최근 활동 로그
dashboard.get('/recent-activities', async (c) => {
  try {
    const db = c.env.DB
    const userId = c.req.query('userId')
    const limit = parseInt(c.req.query('limit') || '10')
    
    if (!userId) {
      return c.json({ error: 'User ID required' }, 400)
    }

    // 최근 주문
    const { results: recentOrders } = await db.prepare(`
      SELECT 
        'order' as type,
        o.id,
        o.order_number as reference,
        o.customer_name as details,
        o.total_amount as amount,
        o.status,
        o.created_at
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
      LIMIT ?
    `).bind(userId, limit).all()

    // 최근 상품 등록
    const { results: recentProducts } = await db.prepare(`
      SELECT 
        'product' as type,
        p.id,
        p.name_ko as reference,
        p.category as details,
        p.price as amount,
        p.status,
        p.created_at
      FROM products p
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
      LIMIT ?
    `).bind(userId, limit).all()

    // 최근 정산
    const { results: recentSettlements } = await db.prepare(`
      SELECT 
        'settlement' as type,
        s.id,
        '정산-' || s.id as reference,
        s.settlement_date as details,
        s.net_amount as amount,
        s.status,
        s.created_at
      FROM settlements s
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
      LIMIT ?
    `).bind(userId, limit).all()

    // 모든 활동 합치고 정렬
    const activities = [
      ...recentOrders,
      ...recentProducts,
      ...recentSettlements
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, limit)

    return c.json({
      success: true,
      activities
    })
  } catch (error) {
    console.error('Recent activities error:', error)
    return c.json({ error: 'Failed to fetch recent activities' }, 500)
  }
})

export default dashboard
