import { Hono } from 'hono'
import type { Env } from '../types'

const notifications = new Hono<{ Bindings: Env }>()

// 알림 전송 (이메일/SMS)
notifications.post('/send', async (c) => {
  try {
    const { type, recipient, subject, message, channel } = await c.req.json()

    if (!type || !recipient || !message) {
      return c.json({ error: 'Type, recipient, and message required' }, 400)
    }

    const db = c.env.DB
    
    // 알림 저장
    await db.prepare(`
      INSERT INTO notifications (
        type, recipient, subject, message, channel, status
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      type, recipient, subject || '', message, channel || 'email', 'pending'
    ).run()
    
    // 실제 전송 (데모에서는 시뮬레이션)
    const sent = await sendNotification(channel || 'email', recipient, subject, message)
    
    if (sent) {
      await db.prepare(`
        UPDATE notifications 
        SET status = 'sent', sent_at = CURRENT_TIMESTAMP
        WHERE recipient = ? AND status = 'pending'
      `).bind(recipient).run()
    }

    return c.json({
      success: true,
      notification: {
        type,
        recipient,
        subject,
        message,
        channel: channel || 'email',
        status: sent ? 'sent' : 'failed'
      }
    })
  } catch (error) {
    console.error('Notification send error:', error)
    return c.json({ error: 'Failed to send notification' }, 500)
  }
})

// 재고 알림 체크
notifications.post('/check-inventory', async (c) => {
  try {
    const db = c.env.DB
    
    // 재고가 부족한 상품 조회 (10개 이하)
    const { results: lowStockProducts } = await db.prepare(`
      SELECT p.*, u.email, u.name 
      FROM products p
      JOIN users u ON p.user_id = u.id
      WHERE p.stock_quantity <= 10 AND p.stock_quantity > 0
    `).all()
    
    // 재고가 없는 상품 조회
    const { results: outOfStockProducts } = await db.prepare(`
      SELECT p.*, u.email, u.name 
      FROM products p
      JOIN users u ON p.user_id = u.id
      WHERE p.stock_quantity = 0
    `).all()
    
    const alerts = []
    
    // 재고 부족 알림
    for (const product of lowStockProducts) {
      const message = `[재고 부족 알림] ${product.name_ko} 상품의 재고가 ${product.stock_quantity}개 남았습니다. 재고를 보충해주세요.`
      
      await db.prepare(`
        INSERT INTO notifications (type, recipient, message, channel, status)
        VALUES (?, ?, ?, ?, ?)
      `).bind('low_stock', product.email, message, 'email', 'pending').run()
      
      alerts.push({
        productId: product.id,
        productName: product.name_ko,
        stockQuantity: product.stock_quantity,
        type: 'low_stock'
      })
    }
    
    // 재고 소진 알림
    for (const product of outOfStockProducts) {
      const message = `[재고 소진 알림] ${product.name_ko} 상품의 재고가 소진되었습니다. 즉시 재고를 보충하거나 판매를 중단하세요.`
      
      await db.prepare(`
        INSERT INTO notifications (type, recipient, message, channel, status)
        VALUES (?, ?, ?, ?, ?)
      `).bind('out_of_stock', product.email, message, 'email', 'urgent').run()
      
      alerts.push({
        productId: product.id,
        productName: product.name_ko,
        stockQuantity: 0,
        type: 'out_of_stock'
      })
    }

    return c.json({
      success: true,
      alerts,
      summary: {
        lowStock: lowStockProducts.length,
        outOfStock: outOfStockProducts.length
      }
    })
  } catch (error) {
    console.error('Inventory check error:', error)
    return c.json({ error: 'Failed to check inventory' }, 500)
  }
})

// 주문 알림
notifications.post('/order-notification', async (c) => {
  try {
    const { orderId, type } = await c.req.json()

    if (!orderId || !type) {
      return c.json({ error: 'Order ID and type required' }, 400)
    }

    const db = c.env.DB
    
    // 주문 정보 조회
    const order = await db.prepare(`
      SELECT o.*, u.email, u.name, p.name_ko as product_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN products p ON o.product_id = p.id
      WHERE o.id = ?
    `).bind(orderId).first()
    
    if (!order) {
      return c.json({ error: 'Order not found' }, 404)
    }
    
    const messages: Record<string, string> = {
      'new_order': `새로운 주문이 접수되었습니다. 주문번호: ${order.id}, 상품: ${order.product_name}`,
      'shipped': `주문하신 ${order.product_name} 상품이 발송되었습니다. 배송 추적번호: ${order.tracking_number || 'N/A'}`,
      'delivered': `주문하신 ${order.product_name} 상품이 배송 완료되었습니다.`,
      'cancelled': `주문번호 ${order.id}의 주문이 취소되었습니다.`
    }
    
    const message = messages[type] || '주문 상태가 업데이트되었습니다.'
    
    await db.prepare(`
      INSERT INTO notifications (type, recipient, message, channel, status)
      VALUES (?, ?, ?, ?, ?)
    `).bind(type, order.email, message, 'email', 'pending').run()
    
    // 이메일 전송 시뮬레이션
    await sendNotification('email', order.email, `주문 ${type}`, message)

    return c.json({
      success: true,
      notification: {
        type,
        recipient: order.email,
        message
      }
    })
  } catch (error) {
    console.error('Order notification error:', error)
    return c.json({ error: 'Failed to send order notification' }, 500)
  }
})

// 정산 알림
notifications.post('/settlement-notification', async (c) => {
  try {
    const { userId, amount, period } = await c.req.json()

    if (!userId || !amount) {
      return c.json({ error: 'User ID and amount required' }, 400)
    }

    const db = c.env.DB
    
    const user = await db.prepare(`
      SELECT * FROM users WHERE id = ?
    `).bind(userId).first()
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }
    
    const message = `${period || '이번 달'} 정산 금액 ${amount.toLocaleString()}원이 확정되었습니다. 3영업일 내 입금될 예정입니다.`
    
    await db.prepare(`
      INSERT INTO notifications (type, recipient, message, channel, status)
      VALUES (?, ?, ?, ?, ?)
    `).bind('settlement', user.email, message, 'email', 'pending').run()
    
    await sendNotification('email', user.email, '정산 알림', message)

    return c.json({
      success: true,
      notification: {
        type: 'settlement',
        recipient: user.email,
        message
      }
    })
  } catch (error) {
    console.error('Settlement notification error:', error)
    return c.json({ error: 'Failed to send settlement notification' }, 500)
  }
})

// 알림 조회
notifications.get('/', async (c) => {
  try {
    const db = c.env.DB
    const recipient = c.req.query('recipient')
    const status = c.req.query('status')
    
    let query = 'SELECT * FROM notifications WHERE 1=1'
    const params: any[] = []
    
    if (recipient) {
      query += ' AND recipient = ?'
      params.push(recipient)
    }
    
    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }
    
    query += ' ORDER BY created_at DESC LIMIT 50'
    
    const { results } = await db.prepare(query).bind(...params).all()
    
    return c.json({
      success: true,
      notifications: results
    })
  } catch (error) {
    console.error('Notification list error:', error)
    return c.json({ error: 'Failed to fetch notifications' }, 500)
  }
})

// 유틸리티 함수

async function sendNotification(
  channel: string, 
  recipient: string, 
  subject: string, 
  message: string
): Promise<boolean> {
  // 실제 환경에서는 이메일 API (SendGrid, Mailgun) 또는 SMS API (Twilio) 호출
  // 여기서는 시뮬레이션
  
  console.log(`[${channel.toUpperCase()}] To: ${recipient}`)
  console.log(`Subject: ${subject}`)
  console.log(`Message: ${message}`)
  
  // 90% 성공률 시뮬레이션
  return Math.random() > 0.1
}

export default notifications
