const redis = require('../config/redis');
const { Product, sequelize } = require('../models');
const Joi = require('joi');

// 1. 秒杀请求接口 (Producer)
const create = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id; // From auth middleware

    // 1. 校验商品是否在秒杀活动中
    // 优化：可以先查缓存，这里简化查库
    const product = await Product.findByPk(productId);
    if (!product || product.is_promotion !== 1 || product.status !== 1) {
      return res.status(400).json({ code: 400, message: '商品不在秒杀活动中' });
    }

    // 2. Redis 预扣减库存
    const stockKey = `seckill:stock:${productId}`;
    const stock = await redis.decr(stockKey);

    if (stock < 0) {
      // 库存不足，回滚 Redis 库存（可选，避免负数过大，但不影响逻辑）
      // await redis.incr(stockKey); 
      return res.status(200).json({ code: 400, message: '秒杀库存不足' });
    }

    // 3. 入队
    const payload = JSON.stringify({
      productId,
      userId,
      username: req.user.username,
      timestamp: Date.now()
    });
    await redis.lpush('seckill:queue', payload);

    // 4. 设置初始状态为处理中
    await redis.set(`seckill:result:${userId}:${productId}`, JSON.stringify({ status: 'processing' }), 'EX', 3600);

    res.json({ code: 200, message: '秒杀请求已受理，请等待结果' });
  } catch (error) {
    next(error);
  }
};

// 2. 查询秒杀结果接口
const getResult = async (req, res, next) => {
  try {
    const { productId } = req.query;
    const userId = req.user.id;

    if (!productId) return res.status(400).json({ code: 400, message: 'ProductId is required' });

    const resultStr = await redis.get(`seckill:result:${userId}:${productId}`);
    
    if (!resultStr) {
      // 可能是排队中还没处理到，或者是根本没请求过
      // 简单处理：如果没结果，认为是排队中或失败
      return res.json({ code: 200, data: { status: 'pending', message: '排队中或未开始' } });
    }

    const result = JSON.parse(resultStr);
    res.json({ code: 200, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getResult
};
