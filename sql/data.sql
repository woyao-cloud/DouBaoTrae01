-- 测试数据脚本

-- 插入管理员 (密码: 123456, bcrypt hash)
-- 注意：实际生产环境中密码应该是哈希值。这里假设后端会处理或者我们预生成一个。
-- $2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW 是 123456 的 bcrypt hash
INSERT INTO admins (username, password, nickname, role, status) VALUES 
('admin', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '超级管理员', 1, 1),
('editor', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '内容编辑', 2, 1);

-- 插入分类
INSERT INTO product_categories (name, parent_id, sort) VALUES 
('电子产品', 0, 10),
('服装', 0, 20),
('手机', 1, 10),
('笔记本', 1, 20),
('男装', 2, 10),
('女装', 2, 20);

-- 插入商品
INSERT INTO products (product_code, name, category_id, price, cost_price, stock, status, is_promotion, promotion_stock, description, cover_image) VALUES 
('P001', 'iPhone 15 Pro', 3, 7999.00, 6000.00, 100, 1, 1, 10, '苹果最新旗舰手机 - 秒杀活动中', 'https://placeholder.com/iphone.jpg'),
('P002', 'MacBook Air M3', 4, 8999.00, 7000.00, 50, 1, 0, 0, '轻薄笔记本', 'https://placeholder.com/macbook.jpg'),
('P003', '夏季T恤', 5, 99.00, 30.00, 200, 1, 0, 0, '纯棉透气', 'https://placeholder.com/tshirt.jpg');

