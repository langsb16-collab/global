-- Phase 1 MVP Additional Tables
-- 견적서, 에스크로, 분쟁, 알림 테이블 추가

-- Quotations Table (견적서)
CREATE TABLE IF NOT EXISTS quotations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quotation_number TEXT UNIQUE NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_company TEXT,
  buyer_country TEXT,
  subtotal REAL NOT NULL,
  shipping_cost REAL DEFAULT 0,
  platform_fee REAL DEFAULT 0,
  total REAL NOT NULL,
  currency TEXT DEFAULT 'KRW',
  exchange_rate REAL DEFAULT 1,
  shipping_method TEXT,
  payment_terms TEXT,
  notes TEXT,
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  valid_until DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Quotation Items Table (견적서 항목)
CREATE TABLE IF NOT EXISTS quotation_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quotation_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Escrows Table (에스크로)
CREATE TABLE IF NOT EXISTS escrows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  escrow_number TEXT UNIQUE NOT NULL,
  order_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'KRW',
  buyer_id INTEGER NOT NULL,
  seller_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'funded', 'released', 'refunded', 'disputed', 'cancelled')),
  funded_at DATETIME,
  released_at DATETIME,
  refunded_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (seller_id) REFERENCES users(id)
);

-- Escrow History Table (에스크로 이력)
CREATE TABLE IF NOT EXISTS escrow_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  escrow_id INTEGER NOT NULL,
  status TEXT NOT NULL,
  reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (escrow_id) REFERENCES escrows(id) ON DELETE CASCADE
);

-- Disputes Table (분쟁)
CREATE TABLE IF NOT EXISTS disputes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  escrow_id INTEGER NOT NULL,
  raised_by_user_id INTEGER NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open' CHECK(status IN ('open', 'reviewing', 'resolved', 'closed')),
  resolution TEXT,
  winner TEXT CHECK(winner IN ('buyer', 'seller', NULL)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME,
  FOREIGN KEY (escrow_id) REFERENCES escrows(id),
  FOREIGN KEY (raised_by_user_id) REFERENCES users(id)
);

-- Notifications Table (알림)
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  channel TEXT DEFAULT 'email' CHECK(channel IN ('email', 'sms', 'push')),
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'sent', 'failed', 'urgent')),
  sent_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AI Analysis Cache Table (AI 분석 캐시)
CREATE TABLE IF NOT EXISTS ai_analysis_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_url TEXT NOT NULL,
  analysis_type TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(image_url, analysis_type)
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_quotations_buyer_email ON quotations(buyer_email);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation_id ON quotation_items(quotation_id);
CREATE INDEX IF NOT EXISTS idx_escrows_order_id ON escrows(order_id);
CREATE INDEX IF NOT EXISTS idx_escrows_buyer_id ON escrows(buyer_id);
CREATE INDEX IF NOT EXISTS idx_escrows_seller_id ON escrows(seller_id);
CREATE INDEX IF NOT EXISTS idx_escrows_status ON escrows(status);
CREATE INDEX IF NOT EXISTS idx_disputes_escrow_id ON disputes(escrow_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
