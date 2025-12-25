import { Hono } from 'hono'
import type { Env } from '../types'

const quotations = new Hono<{ Bindings: Env }>()

// 견적서 생성
quotations.post('/', async (c) => {
  try {
    const {
      buyerName,
      buyerEmail,
      buyerCompany,
      buyerCountry,
      products,
      shippingMethod,
      paymentTerms,
      notes
    } = await c.req.json()

    if (!buyerEmail || !products || products.length === 0) {
      return c.json({ error: 'Buyer email and products required' }, 400)
    }

    const db = c.env.DB
    const quotationNumber = `QT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    // 환율 정보 가져오기
    const exchangeRates = await getExchangeRates()
    const buyerCurrency = getCurrencyByCountry(buyerCountry || 'USA')
    const exchangeRate = exchangeRates[buyerCurrency] || 1
    
    // 제품 정보 계산
    let subtotal = 0
    const quotationItems = []
    
    for (const item of products) {
      const product = await db.prepare(`
        SELECT * FROM products WHERE id = ?
      `).bind(item.productId).first()
      
      if (!product) continue
      
      const itemTotal = product.price * item.quantity
      subtotal += itemTotal
      
      quotationItems.push({
        productId: product.id,
        productName: product.name_ko,
        quantity: item.quantity,
        unitPrice: product.price,
        unitPriceConverted: Math.round(product.price / exchangeRate),
        total: itemTotal,
        totalConverted: Math.round(itemTotal / exchangeRate),
        weight: product.weight,
        hsCode: product.hs_code
      })
    }
    
    // 배송비 계산 (간단한 로직)
    const shippingCost = calculateShippingCost(quotationItems, buyerCountry, shippingMethod)
    const platformFee = Math.round(subtotal * 0.10) // 10% 플랫폼 수수료
    const total = subtotal + shippingCost + platformFee
    
    // 견적서 저장
    await db.prepare(`
      INSERT INTO quotations (
        quotation_number, buyer_name, buyer_email, buyer_company, buyer_country,
        subtotal, shipping_cost, platform_fee, total, currency, exchange_rate,
        shipping_method, payment_terms, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      quotationNumber, buyerName, buyerEmail, buyerCompany, buyerCountry,
      subtotal, shippingCost, platformFee, total, buyerCurrency, exchangeRate,
      shippingMethod || 'sea_freight', paymentTerms || 'T/T', notes || '', 'draft'
    ).run()

    const quotation = await db.prepare(`
      SELECT * FROM quotations WHERE quotation_number = ?
    `).bind(quotationNumber).first()
    
    // 견적서 아이템 저장
    for (const item of quotationItems) {
      await db.prepare(`
        INSERT INTO quotation_items (
          quotation_id, product_id, quantity, unit_price, total_price
        ) VALUES (?, ?, ?, ?, ?)
      `).bind(
        quotation.id, item.productId, item.quantity, item.unitPrice, item.total
      ).run()
    }

    return c.json({
      success: true,
      quotation: {
        id: quotation.id,
        quotationNumber,
        buyer: {
          name: buyerName,
          email: buyerEmail,
          company: buyerCompany,
          country: buyerCountry
        },
        items: quotationItems,
        pricing: {
          subtotal,
          subtotalConverted: Math.round(subtotal / exchangeRate),
          shippingCost,
          shippingCostConverted: Math.round(shippingCost / exchangeRate),
          platformFee,
          platformFeeConverted: Math.round(platformFee / exchangeRate),
          total,
          totalConverted: Math.round(total / exchangeRate),
          currency: buyerCurrency,
          exchangeRate: exchangeRate.toFixed(2)
        },
        shipping: {
          method: shippingMethod || 'sea_freight',
          estimatedDays: getShippingDays(shippingMethod, buyerCountry)
        },
        paymentTerms: paymentTerms || 'T/T',
        notes,
        status: 'draft',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    })
  } catch (error) {
    console.error('Quotation creation error:', error)
    return c.json({ error: 'Failed to create quotation' }, 500)
  }
})

// 견적서 조회
quotations.get('/', async (c) => {
  try {
    const db = c.env.DB
    const status = c.req.query('status')
    
    let query = 'SELECT * FROM quotations'
    const params: any[] = []
    
    if (status) {
      query += ' WHERE status = ?'
      params.push(status)
    }
    
    query += ' ORDER BY created_at DESC'
    
    const { results } = await db.prepare(query).bind(...params).all()
    
    return c.json({
      success: true,
      quotations: results
    })
  } catch (error) {
    console.error('Quotation list error:', error)
    return c.json({ error: 'Failed to fetch quotations' }, 500)
  }
})

// 견적서 상세 조회
quotations.get('/:id', async (c) => {
  try {
    const db = c.env.DB
    const id = c.req.param('id')
    
    const quotation = await db.prepare(`
      SELECT * FROM quotations WHERE id = ?
    `).bind(id).first()
    
    if (!quotation) {
      return c.json({ error: 'Quotation not found' }, 404)
    }
    
    const { results: items } = await db.prepare(`
      SELECT qi.*, p.name_ko, p.name_en, p.description_ko
      FROM quotation_items qi
      JOIN products p ON qi.product_id = p.id
      WHERE qi.quotation_id = ?
    `).bind(id).all()
    
    return c.json({
      success: true,
      quotation: {
        ...quotation,
        items
      }
    })
  } catch (error) {
    console.error('Quotation detail error:', error)
    return c.json({ error: 'Failed to fetch quotation' }, 500)
  }
})

// 견적서 상태 업데이트
quotations.patch('/:id/status', async (c) => {
  try {
    const db = c.env.DB
    const id = c.req.param('id')
    const { status } = await c.req.json()
    
    if (!['draft', 'sent', 'accepted', 'rejected', 'expired'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400)
    }
    
    await db.prepare(`
      UPDATE quotations SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(status, id).run()
    
    return c.json({ success: true, status })
  } catch (error) {
    console.error('Quotation status update error:', error)
    return c.json({ error: 'Failed to update quotation status' }, 500)
  }
})

// 유틸리티 함수들

async function getExchangeRates(): Promise<Record<string, number>> {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/KRW')
    const data = await response.json()
    return data.rates
  } catch (error) {
    // 폴백 환율
    return {
      USD: 0.00075,
      EUR: 0.00070,
      JPY: 0.11,
      CNY: 0.0054,
      SGD: 0.0010
    }
  }
}

function getCurrencyByCountry(country: string): string {
  const currencyMap: Record<string, string> = {
    'USA': 'USD',
    'United States': 'USD',
    'Japan': 'JPY',
    'China': 'CNY',
    'Singapore': 'SGD',
    'UK': 'GBP',
    'Germany': 'EUR',
    'France': 'EUR',
    'Italy': 'EUR'
  }
  
  return currencyMap[country] || 'USD'
}

function calculateShippingCost(items: any[], country: string, method: string): number {
  const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0)
  
  const baseCosts: Record<string, number> = {
    'sea_freight': 50000,
    'air_freight': 150000,
    'express': 200000
  }
  
  const baseCost = baseCosts[method] || baseCosts['sea_freight']
  const weightCost = totalWeight * 5000 // kg당 5,000원
  
  return Math.round(baseCost + weightCost)
}

function getShippingDays(method: string, country: string): string {
  const shippingTimes: Record<string, string> = {
    'sea_freight': '30-45 days',
    'air_freight': '7-14 days',
    'express': '3-5 days'
  }
  
  return shippingTimes[method] || '30-45 days'
}

export default quotations
