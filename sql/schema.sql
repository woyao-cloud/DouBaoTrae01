-- 初始化建表脚本

-- 启用扩展（如果需要）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 商品分类表
CREATE TABLE IF NOT EXISTS product_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    parent_id BIGINT NOT NULL DEFAULT 0,
    sort INT NOT NULL DEFAULT 0,
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE product_categories IS '商品分类表';
COMMENT ON COLUMN product_categories.parent_id IS '父分类ID，0为一级分类';

-- 2. 商品表
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    product_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category_id BIGINT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    cost_price NUMERIC(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    status SMALLINT NOT NULL DEFAULT 1,
    is_promotion SMALLINT NOT NULL DEFAULT 0,
    promotion_stock INT NOT NULL DEFAULT 0,
    description TEXT,
    cover_image VARCHAR(255),
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category
      FOREIGN KEY(category_id) 
      REFERENCES product_categories(id)
      ON DELETE SET NULL
);

COMMENT ON TABLE products IS '商品表';
COMMENT ON COLUMN products.status IS '1-上架，0-下架';
COMMENT ON COLUMN products.is_promotion IS '1-秒杀活动中，0-无活动';
COMMENT ON COLUMN products.promotion_stock IS '秒杀库存';

-- 3. 管理员表
CREATE TABLE IF NOT EXISTS admins (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    role SMALLINT NOT NULL DEFAULT 2,
    status SMALLINT NOT NULL DEFAULT 1,
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE admins IS '管理员表';
COMMENT ON COLUMN admins.role IS '1-超级管理员，2-普通管理员';
COMMENT ON COLUMN admins.status IS '1-启用，0-禁用';

-- 索引
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_product_categories_parent_id ON product_categories(parent_id);
