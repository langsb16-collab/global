// Farm2World Type Definitions

export interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  CACHE: KVNamespace;
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  role: 'farmer' | 'admin' | 'manager';
  phone?: string;
  business_name?: string;
  business_number?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  is_active: number;
}

export interface Product {
  id: number;
  user_id: number;
  name_ko: string;
  name_en?: string;
  name_zh?: string;
  name_ja?: string;
  description_ko: string;
  description_en?: string;
  description_zh?: string;
  description_ja?: string;
  category: string;
  subcategory?: string;
  origin_country: string;
  origin_region?: string;
  price: number;
  cost_price?: number;
  currency: string;
  stock_quantity: number;
  weight?: number;
  weight_unit?: string;
  hs_code?: string;
  status: 'pending' | 'approved' | 'rejected' | 'published' | 'unpublished';
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  image_order: number;
  is_primary: number;
  created_at: string;
}

export interface ProductPlatform {
  id: number;
  product_id: number;
  platform_name: 'amazon' | 'shopee' | 'lazada' | 'etsy' | 'alibaba' | 'rakuten' | 'coupang' | 'yami';
  platform_product_id?: string;
  platform_url?: string;
  platform_price?: number;
  platform_currency?: string;
  status: 'pending' | 'published' | 'failed' | 'unpublished';
  last_synced_at?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  product_id: number;
  user_id: number;
  platform_name: string;
  platform_order_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address: string;
  shipping_country: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'refunded';
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Settlement {
  id: number;
  user_id: number;
  order_id: number;
  settlement_date: string;
  product_revenue: number;
  platform_fee: number;
  shipping_fee: number;
  transaction_fee: number;
  exchange_rate: number;
  net_amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled';
  paid_at?: string;
  created_at: string;
}

export interface TranslationCache {
  id: number;
  source_text: string;
  source_lang: string;
  target_lang: string;
  translated_text: string;
  service: string;
  created_at: string;
}

export interface PriceHistory {
  id: number;
  product_id: number;
  platform_name: string;
  competitor_name?: string;
  price: number;
  currency: string;
  crawled_at: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
