// Products Routes

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { translateProductTexts } from '../utils/translation';
import type { Env, Product, APIResponse, JWTPayload } from '../types';

const products = new Hono<{ Bindings: Env; Variables: { user: JWTPayload } }>();

// Get all products (with pagination)
products.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const status = c.req.query('status');
    const category = c.req.query('category');
    const userId = c.req.query('userId');
    
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const { results } = await c.env.DB.prepare(query).bind(...params).all<Product>();
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams: any[] = [];
    
    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    
    if (userId) {
      countQuery += ' AND user_id = ?';
      countParams.push(userId);
    }
    
    const countResult = await c.env.DB.prepare(countQuery).bind(...countParams).first<{ total: number }>();
    const total = countResult?.total || 0;
    
    return c.json<APIResponse>({
      success: true,
      data: {
        products: results,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get products error:', error);
    return c.json<APIResponse>({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

// Get single product
products.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const product = await c.env.DB.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).bind(id).first<Product>();
    
    if (!product) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Product not found' 
      }, 404);
    }
    
    // Get product images
    const { results: images } = await c.env.DB.prepare(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY image_order, is_primary DESC'
    ).bind(id).all();
    
    // Get platform connections
    const { results: platforms } = await c.env.DB.prepare(
      'SELECT * FROM product_platforms WHERE product_id = ?'
    ).bind(id).all();
    
    return c.json<APIResponse>({
      success: true,
      data: {
        ...product,
        images,
        platforms
      }
    });
    
  } catch (error) {
    console.error('Get product error:', error);
    return c.json<APIResponse>({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

// Create new product (authenticated)
products.post('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    
    const {
      name_ko,
      description_ko,
      category,
      subcategory,
      origin_country,
      origin_region,
      price,
      cost_price,
      currency,
      stock_quantity,
      weight,
      weight_unit,
      hs_code,
      auto_translate
    } = body;
    
    if (!name_ko || !description_ko || !category || !price) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Required fields: name_ko, description_ko, category, price' 
      }, 400);
    }
    
    // Auto translate if requested
    let translations = {
      name_en: '',
      name_zh: '',
      name_ja: '',
      description_en: '',
      description_zh: '',
      description_ja: ''
    };
    
    if (auto_translate !== false) {
      translations = await translateProductTexts(name_ko, description_ko);
    }
    
    // Insert product
    const result = await c.env.DB.prepare(`
      INSERT INTO products (
        user_id, name_ko, name_en, name_zh, name_ja,
        description_ko, description_en, description_zh, description_ja,
        category, subcategory, origin_country, origin_region,
        price, cost_price, currency, stock_quantity,
        weight, weight_unit, hs_code, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      user.userId,
      name_ko,
      translations.name_en,
      translations.name_zh,
      translations.name_ja,
      description_ko,
      translations.description_en,
      translations.description_zh,
      translations.description_ja,
      category,
      subcategory || null,
      origin_country || 'KR',
      origin_region || null,
      price,
      cost_price || null,
      currency || 'KRW',
      stock_quantity || 0,
      weight || null,
      weight_unit || 'kg',
      hs_code || null,
      'pending'
    ).run();
    
    if (!result.success) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Failed to create product' 
      }, 500);
    }
    
    return c.json<APIResponse>({
      success: true,
      data: { 
        productId: result.meta.last_row_id,
        translations 
      },
      message: 'Product created successfully'
    }, 201);
    
  } catch (error) {
    console.error('Create product error:', error);
    return c.json<APIResponse>({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

// Update product (authenticated)
products.put('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const id = c.req.param('id');
    const body = await c.req.json();
    
    // Check if product exists and belongs to user (unless admin)
    const existing = await c.env.DB.prepare(
      'SELECT user_id FROM products WHERE id = ?'
    ).bind(id).first<{ user_id: number }>();
    
    if (!existing) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Product not found' 
      }, 404);
    }
    
    if (user.role !== 'admin' && existing.user_id !== user.userId) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Unauthorized to update this product' 
      }, 403);
    }
    
    // Build update query dynamically
    const updates: string[] = [];
    const params: any[] = [];
    
    const allowedFields = [
      'name_ko', 'name_en', 'name_zh', 'name_ja',
      'description_ko', 'description_en', 'description_zh', 'description_ja',
      'category', 'subcategory', 'origin_country', 'origin_region',
      'price', 'cost_price', 'currency', 'stock_quantity',
      'weight', 'weight_unit', 'hs_code', 'status'
    ];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(body[field]);
      }
    }
    
    if (updates.length === 0) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'No fields to update' 
      }, 400);
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);
    
    const query = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
    const result = await c.env.DB.prepare(query).bind(...params).run();
    
    if (!result.success) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Failed to update product' 
      }, 500);
    }
    
    return c.json<APIResponse>({
      success: true,
      message: 'Product updated successfully'
    });
    
  } catch (error) {
    console.error('Update product error:', error);
    return c.json<APIResponse>({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

// Delete product (authenticated)
products.delete('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const id = c.req.param('id');
    
    // Check if product exists and belongs to user (unless admin)
    const existing = await c.env.DB.prepare(
      'SELECT user_id FROM products WHERE id = ?'
    ).bind(id).first<{ user_id: number }>();
    
    if (!existing) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Product not found' 
      }, 404);
    }
    
    if (user.role !== 'admin' && existing.user_id !== user.userId) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Unauthorized to delete this product' 
      }, 403);
    }
    
    const result = await c.env.DB.prepare(
      'DELETE FROM products WHERE id = ?'
    ).bind(id).run();
    
    if (!result.success) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Failed to delete product' 
      }, 500);
    }
    
    return c.json<APIResponse>({
      success: true,
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete product error:', error);
    return c.json<APIResponse>({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

export default products;
