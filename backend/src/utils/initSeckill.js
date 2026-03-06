const { Product } = require('../models');
const redis = require('../config/redis');

const initSeckillStock = async () => {
  try {
    const products = await Product.findAll({
      where: {
        is_promotion: 1,
        status: 1
      }
    });

    for (const product of products) {
      const key = `seckill:stock:${product.id}`;
      // 只在 key 不存在时设置，避免覆盖运行时数据
      const exists = await redis.exists(key);
      if (!exists) {
        await redis.set(key, product.promotion_stock);
        console.log(`Initialized seckill stock for product ${product.id}: ${product.promotion_stock}`);
      }
    }
  } catch (error) {
    console.error('Failed to initialize seckill stock:', error);
  }
};

module.exports = initSeckillStock;
