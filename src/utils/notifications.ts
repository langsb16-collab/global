/**
 * 알림 시스템 유틸리티
 */

export interface NotificationPayload {
  userId: number;
  type: 'stock' | 'shipment' | 'order' | 'payment' | 'system';
  title: string;
  message: string;
}

/**
 * 알림 생성
 */
export async function createNotification(
  db: D1Database,
  payload: NotificationPayload
): Promise<number> {
  const { userId, type, title, message } = payload;
  
  const result = await db
    .prepare(`
      INSERT INTO notifications (user_id, type, title, message, is_read)
      VALUES (?, ?, ?, ?, 0)
    `)
    .bind(userId, type, title, message)
    .run();
  
  return result.meta.last_row_id as number;
}

/**
 * 재고 부족 알림 생성
 */
export async function createLowStockNotification(
  db: D1Database,
  userId: number,
  productName: string,
  currentStock: number,
  threshold: number
): Promise<void> {
  await createNotification(db, {
    userId,
    type: 'stock',
    title: '재고 부족 알림',
    message: `상품 "${productName}"의 재고가 ${currentStock}개로 설정된 임계값 ${threshold}개 이하입니다. 재고를 보충해주세요.`
  });
}

/**
 * 주문 알림 생성
 */
export async function createOrderNotification(
  db: D1Database,
  userId: number,
  orderId: number,
  status: string
): Promise<void> {
  const statusMessages: Record<string, string> = {
    pending: '새로운 주문이 접수되었습니다.',
    confirmed: '주문이 확정되었습니다.',
    shipped: '상품이 발송되었습니다.',
    delivered: '상품이 배송 완료되었습니다.',
    cancelled: '주문이 취소되었습니다.'
  };
  
  await createNotification(db, {
    userId,
    type: 'order',
    title: '주문 상태 업데이트',
    message: `주문 #${orderId}: ${statusMessages[status] || '상태가 변경되었습니다.'}`
  });
}

/**
 * 결제 알림 생성
 */
export async function createPaymentNotification(
  db: D1Database,
  userId: number,
  amount: number,
  currency: string,
  status: 'success' | 'failed' | 'pending'
): Promise<void> {
  const statusMessages = {
    success: '결제가 완료되었습니다.',
    failed: '결제가 실패했습니다.',
    pending: '결제 처리 중입니다.'
  };
  
  await createNotification(db, {
    userId,
    type: 'payment',
    title: '결제 알림',
    message: `${currency} ${amount.toLocaleString()}: ${statusMessages[status]}`
  });
}

/**
 * 재고 확인 및 알림
 */
export async function checkInventoryAndNotify(
  db: D1Database,
  productId: number
): Promise<void> {
  // 상품 정보 조회
  const product = await db
    .prepare('SELECT * FROM products WHERE id = ?')
    .bind(productId)
    .first();
  
  if (!product) return;
  
  // 알림 설정 조회
  const alerts = await db
    .prepare('SELECT * FROM inventory_alerts WHERE product_id = ? AND is_active = 1')
    .bind(productId)
    .all();
  
  for (const alert of alerts.results) {
    const currentStock = product.stock_quantity as number;
    const threshold = alert.alert_threshold as number;
    
    if (currentStock <= threshold) {
      // 마지막 알림 시간 확인 (24시간에 한 번만)
      const lastAlerted = alert.last_alerted_at as string | null;
      const now = new Date();
      
      if (lastAlerted) {
        const lastAlertTime = new Date(lastAlerted);
        const hoursSinceLastAlert = (now.getTime() - lastAlertTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastAlert < 24) {
          continue; // 24시간 이내에 이미 알림 전송됨
        }
      }
      
      // 알림 생성
      await createLowStockNotification(
        db,
        alert.user_id as number,
        product.name_ko as string,
        currentStock,
        threshold
      );
      
      // 마지막 알림 시간 업데이트
      await db
        .prepare('UPDATE inventory_alerts SET last_alerted_at = CURRENT_TIMESTAMP WHERE id = ?')
        .bind(alert.id)
        .run();
    }
  }
}
