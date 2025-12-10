-- Seed Data for Farm2World Platform
-- 테스트용 샘플 데이터

-- Insert Test Users
INSERT OR IGNORE INTO users (id, email, password_hash, name, role, phone, business_name, business_number, address) VALUES 
  (1, 'admin@farm2world.com', '$2a$10$mockhashedpassword1', '관리자', 'admin', '010-1234-5678', 'Farm2World', '123-45-67890', '서울특별시 강남구'),
  (2, 'farmer1@example.com', '$2a$10$mockhashedpassword2', '김농부', 'farmer', '010-2345-6789', '김씨네 농장', '234-56-78901', '전라북도 완주군'),
  (3, 'farmer2@example.com', '$2a$10$mockhashedpassword3', '이어부', 'farmer', '010-3456-7890', '이씨네 수산', '345-67-89012', '부산광역시 기장군'),
  (4, 'farmer3@example.com', '$2a$10$mockhashedpassword4', '박상인', 'farmer', '010-4567-8901', '박씨네 특산품', '456-78-90123', '경상북도 안동시');

-- Insert Test Products
INSERT OR IGNORE INTO products (id, user_id, name_ko, name_en, description_ko, description_en, category, subcategory, origin_country, origin_region, price, cost_price, currency, stock_quantity, weight, weight_unit, status) VALUES 
  (1, 2, '프리미엄 김', 'Premium Seaweed', '완도에서 자란 최상급 김입니다. 깨끗한 바다에서 자란 김은 영양가가 풍부합니다.', 'Premium seaweed from Wando. Rich in nutrients from clean ocean waters.', 'seafood', 'seaweed', 'KR', '전라남도 완도', 15000, 8000, 'KRW', 500, 0.1, 'kg', 'approved'),
  (2, 2, '유기농 쌀', 'Organic Rice', '무농약으로 재배한 유기농 쌀입니다. 건강하고 맛있는 쌀을 만나보세요.', 'Organic rice grown without pesticides. Healthy and delicious.', 'grain', 'rice', 'KR', '전라북도 완주', 45000, 25000, 'KRW', 1000, 10, 'kg', 'approved'),
  (3, 3, '건조 오징어', 'Dried Squid', '국내산 오징어를 자연 건조시킨 고품질 제품입니다.', 'High-quality dried squid naturally sun-dried.', 'seafood', 'dried_fish', 'KR', '부산광역시', 35000, 20000, 'KRW', 200, 0.5, 'kg', 'approved'),
  (4, 4, '안동 고추장', 'Andong Gochujang', '전통 방식으로 만든 안동 고추장입니다. 깊은 맛과 향이 일품입니다.', 'Traditional Andong gochujang (red chili paste). Deep flavor and aroma.', 'condiment', 'paste', 'KR', '경상북도 안동', 12000, 6000, 'KRW', 300, 1, 'kg', 'approved'),
  (5, 2, '찰보리쌀', 'Glutinous Barley', '국내산 찰보리로 건강에 좋은 곡물입니다.', 'Domestic glutinous barley, healthy grain.', 'grain', 'barley', 'KR', '전라북도 완주', 8000, 4000, 'KRW', 800, 1, 'kg', 'pending');

-- Insert Product Images
INSERT OR IGNORE INTO product_images (product_id, image_url, image_order, is_primary) VALUES 
  (1, 'https://example.com/images/seaweed1.jpg', 1, 1),
  (1, 'https://example.com/images/seaweed2.jpg', 2, 0),
  (2, 'https://example.com/images/rice1.jpg', 1, 1),
  (3, 'https://example.com/images/squid1.jpg', 1, 1),
  (4, 'https://example.com/images/gochujang1.jpg', 1, 1),
  (5, 'https://example.com/images/barley1.jpg', 1, 1);

-- Insert Product Platform Connections
INSERT OR IGNORE INTO product_platforms (product_id, platform_name, platform_price, platform_currency, status) VALUES 
  (1, 'amazon', 15.99, 'USD', 'published'),
  (1, 'shopee', 450, 'THB', 'published'),
  (2, 'amazon', 49.99, 'USD', 'published'),
  (2, 'lazada', 1500, 'THB', 'published'),
  (3, 'shopee', 1050, 'THB', 'published'),
  (4, 'etsy', 12.99, 'USD', 'pending');

-- Insert Test Orders
INSERT OR IGNORE INTO orders (id, order_number, product_id, user_id, platform_name, platform_order_id, customer_name, customer_email, customer_phone, shipping_address, shipping_country, quantity, unit_price, total_amount, currency, status, payment_status) VALUES 
  (1, 'ORD-2024-0001', 1, 2, 'amazon', 'AMZ-123456', 'John Smith', 'john@example.com', '+1-555-0100', '123 Main St, New York, NY 10001', 'US', 5, 15.99, 79.95, 'USD', 'delivered', 'paid'),
  (2, 'ORD-2024-0002', 2, 2, 'amazon', 'AMZ-123457', 'Emily Johnson', 'emily@example.com', '+1-555-0101', '456 Oak Ave, Los Angeles, CA 90001', 'US', 2, 49.99, 99.98, 'USD', 'shipped', 'paid'),
  (3, 'ORD-2024-0003', 1, 2, 'shopee', 'SPE-789012', 'สมชาย วงศ์ใหญ่', 'somchai@example.com', '+66-2-123-4567', '789 Sukhumvit Rd, Bangkok', 'TH', 3, 450, 1350, 'THB', 'confirmed', 'paid'),
  (4, 'ORD-2024-0004', 3, 3, 'shopee', 'SPE-789013', '陳大明', 'chen@example.com', '+886-2-1234-5678', '101 Zhongxiao E Rd, Taipei', 'TW', 1, 1050, 1050, 'THB', 'pending', 'pending');

-- Insert Test Settlements
INSERT OR IGNORE INTO settlements (user_id, order_id, settlement_date, product_revenue, platform_fee, shipping_fee, transaction_fee, exchange_rate, net_amount, currency, status) VALUES 
  (2, 1, '2024-12-01', 79.95, 11.99, 5.00, 2.40, 1300, 78650, 'KRW', 'completed'),
  (2, 2, '2024-12-05', 99.98, 14.99, 7.00, 3.00, 1300, 97487, 'KRW', 'completed'),
  (2, 3, '2024-12-08', 1350, 135, 50, 27, 38, 42826, 'KRW', 'pending');
