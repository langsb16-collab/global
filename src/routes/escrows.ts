import { Hono } from 'hono'
import type { Env } from '../types'

const escrows = new Hono<{ Bindings: Env }>()

// 에스크로 생성
escrows.post('/', async (c) => {
  try {
    const { orderId, amount, currency, buyerId, sellerId } = await c.req.json()

    if (!orderId || !amount || !buyerId || !sellerId) {
      return c.json({ error: 'Order ID, amount, buyer ID, and seller ID required' }, 400)
    }

    const db = c.env.DB
    const escrowNumber = `ESC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    // 에스크로 생성
    await db.prepare(`
      INSERT INTO escrows (
        escrow_number, order_id, amount, currency, buyer_id, seller_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      escrowNumber, orderId, amount, currency || 'KRW', buyerId, sellerId, 'pending'
    ).run()

    const escrow = await db.prepare(`
      SELECT * FROM escrows WHERE escrow_number = ?
    `).bind(escrowNumber).first()

    return c.json({
      success: true,
      escrow: {
        id: escrow.id,
        escrowNumber,
        orderId,
        amount,
        currency: currency || 'KRW',
        status: 'pending',
        buyer_id: buyerId,
        seller_id: sellerId,
        createdAt: escrow.created_at
      }
    })
  } catch (error) {
    console.error('Escrow creation error:', error)
    return c.json({ error: 'Failed to create escrow' }, 500)
  }
})

// 에스크로 조회
escrows.get('/', async (c) => {
  try {
    const db = c.env.DB
    const userId = c.req.query('userId')
    const status = c.req.query('status')
    
    let query = 'SELECT * FROM escrows WHERE 1=1'
    const params: any[] = []
    
    if (userId) {
      query += ' AND (buyer_id = ? OR seller_id = ?)'
      params.push(userId, userId)
    }
    
    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }
    
    query += ' ORDER BY created_at DESC'
    
    const { results } = await db.prepare(query).bind(...params).all()
    
    return c.json({
      success: true,
      escrows: results
    })
  } catch (error) {
    console.error('Escrow list error:', error)
    return c.json({ error: 'Failed to fetch escrows' }, 500)
  }
})

// 에스크로 상세 조회
escrows.get('/:id', async (c) => {
  try {
    const db = c.env.DB
    const id = c.req.param('id')
    
    const escrow = await db.prepare(`
      SELECT * FROM escrows WHERE id = ?
    `).bind(id).first()
    
    if (!escrow) {
      return c.json({ error: 'Escrow not found' }, 404)
    }
    
    return c.json({
      success: true,
      escrow
    })
  } catch (error) {
    console.error('Escrow detail error:', error)
    return c.json({ error: 'Failed to fetch escrow' }, 500)
  }
})

// 에스크로 상태 업데이트
escrows.patch('/:id/status', async (c) => {
  try {
    const db = c.env.DB
    const id = c.req.param('id')
    const { status, reason } = await c.req.json()
    
    const validStatuses = [
      'pending',      // 대기중
      'funded',       // 입금 완료
      'released',     // 판매자에게 지급 완료
      'refunded',     // 구매자에게 환불 완료
      'disputed',     // 분쟁 중
      'cancelled'     // 취소됨
    ]
    
    if (!validStatuses.includes(status)) {
      return c.json({ error: 'Invalid status' }, 400)
    }
    
    // 에스크로 조회
    const escrow = await db.prepare(`
      SELECT * FROM escrows WHERE id = ?
    `).bind(id).first()
    
    if (!escrow) {
      return c.json({ error: 'Escrow not found' }, 404)
    }
    
    // 상태 전환 검증
    const isValidTransition = validateStatusTransition(escrow.status, status)
    if (!isValidTransition) {
      return c.json({ 
        error: `Invalid status transition from ${escrow.status} to ${status}` 
      }, 400)
    }
    
    // 상태 업데이트
    await db.prepare(`
      UPDATE escrows 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(status, id).run()
    
    // 에스크로 히스토리 기록
    await db.prepare(`
      INSERT INTO escrow_history (escrow_id, status, reason, created_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(id, status, reason || '').run()
    
    // 특정 상태일 때 추가 동작
    if (status === 'released') {
      // 주문 상태를 '완료'로 변경
      await db.prepare(`
        UPDATE orders SET status = 'completed' WHERE id = ?
      `).bind(escrow.order_id).run()
    } else if (status === 'refunded') {
      // 주문 상태를 '환불됨'으로 변경
      await db.prepare(`
        UPDATE orders SET status = 'refunded' WHERE id = ?
      `).bind(escrow.order_id).run()
    }
    
    return c.json({ 
      success: true, 
      status,
      message: getStatusMessage(status)
    })
  } catch (error) {
    console.error('Escrow status update error:', error)
    return c.json({ error: 'Failed to update escrow status' }, 500)
  }
})

// 분쟁 제기
escrows.post('/:id/dispute', async (c) => {
  try {
    const db = c.env.DB
    const id = c.req.param('id')
    const { reason, description, userId } = await c.req.json()
    
    if (!reason || !userId) {
      return c.json({ error: 'Reason and user ID required' }, 400)
    }
    
    // 에스크로 조회
    const escrow = await db.prepare(`
      SELECT * FROM escrows WHERE id = ?
    `).bind(id).first()
    
    if (!escrow) {
      return c.json({ error: 'Escrow not found' }, 404)
    }
    
    // 분쟁은 'funded' 상태에서만 가능
    if (escrow.status !== 'funded') {
      return c.json({ 
        error: 'Disputes can only be raised for funded escrows' 
      }, 400)
    }
    
    // 에스크로 상태를 'disputed'로 변경
    await db.prepare(`
      UPDATE escrows 
      SET status = 'disputed', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(id).run()
    
    // 분쟁 기록
    await db.prepare(`
      INSERT INTO disputes (
        escrow_id, raised_by_user_id, reason, description, status
      ) VALUES (?, ?, ?, ?, ?)
    `).bind(
      id, userId, reason, description || '', 'open'
    ).run()
    
    return c.json({
      success: true,
      message: 'Dispute raised successfully',
      status: 'disputed'
    })
  } catch (error) {
    console.error('Dispute creation error:', error)
    return c.json({ error: 'Failed to raise dispute' }, 500)
  }
})

// 분쟁 해결
escrows.post('/:id/resolve-dispute', async (c) => {
  try {
    const db = c.env.DB
    const id = c.req.param('id')
    const { resolution, winner } = await c.req.json()
    
    if (!resolution || !winner) {
      return c.json({ error: 'Resolution and winner required' }, 400)
    }
    
    // 에스크로 조회
    const escrow = await db.prepare(`
      SELECT * FROM escrows WHERE id = ?
    `).bind(id).first()
    
    if (!escrow || escrow.status !== 'disputed') {
      return c.json({ error: 'Invalid escrow or not in dispute' }, 400)
    }
    
    // 분쟁 해결에 따른 상태 변경
    const newStatus = winner === 'buyer' ? 'refunded' : 'released'
    
    await db.prepare(`
      UPDATE escrows 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(newStatus, id).run()
    
    // 분쟁 상태 업데이트
    await db.prepare(`
      UPDATE disputes 
      SET status = 'resolved', resolution = ?, winner = ?
      WHERE escrow_id = ? AND status = 'open'
    `).bind(resolution, winner, id).run()
    
    return c.json({
      success: true,
      message: 'Dispute resolved successfully',
      status: newStatus,
      winner
    })
  } catch (error) {
    console.error('Dispute resolution error:', error)
    return c.json({ error: 'Failed to resolve dispute' }, 500)
  }
})

// 유틸리티 함수들

function validateStatusTransition(currentStatus: string, newStatus: string): boolean {
  const transitions: Record<string, string[]> = {
    'pending': ['funded', 'cancelled'],
    'funded': ['released', 'refunded', 'disputed', 'cancelled'],
    'disputed': ['released', 'refunded'],
    'released': [],
    'refunded': [],
    'cancelled': []
  }
  
  return transitions[currentStatus]?.includes(newStatus) || false
}

function getStatusMessage(status: string): string {
  const messages: Record<string, string> = {
    'pending': '에스크로가 생성되었습니다. 구매자의 입금을 기다리고 있습니다.',
    'funded': '구매자가 입금을 완료했습니다. 판매자는 상품을 발송해주세요.',
    'released': '판매자에게 대금이 지급되었습니다.',
    'refunded': '구매자에게 환불이 완료되었습니다.',
    'disputed': '분쟁이 제기되었습니다. 관리자가 검토 중입니다.',
    'cancelled': '에스크로가 취소되었습니다.'
  }
  
  return messages[status] || '상태가 업데이트되었습니다.'
}

export default escrows
