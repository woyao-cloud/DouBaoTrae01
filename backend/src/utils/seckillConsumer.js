const redis = require('../config/redis');
const { Product, sequelize } = require('../models');

const startConsumer = async () => {
  console.log('Seckill consumer started...');
  
  while (true) {
    try {
      // 阻塞式获取队列消息，避免空轮询 CPU 飙升
      // BRPOP returns [key, value]
      const result = await redis.brpop('seckill:queue', 0); 
      const payload = JSON.parse(result[1]);
      const { productId, userId } = payload;

      await handleSeckill(productId, userId);
    } catch (error) {
      console.error('Consumer error:', error);
      // 防止死循环报错，稍作休眠
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

const handleSeckill = async (productId, userId) => {
  const transaction = await sequelize.transaction();
  
  try {
    // 乐观锁扣减库存
    // UPDATE products SET promotion_stock = promotion_stock - 1 WHERE id = ? AND promotion_stock > 0
    const [updateCount] = await Product.update(
      { promotion_stock: sequelize.literal('promotion_stock - 1') },
      {
        where: {
          id: productId,
          is_promotion: 1,
          status: 1,
          promotion_stock: { [require('sequelize').Op.gt]: 0 }
        },
        transaction
      }
    );

    if (updateCount === 0) {
      // 扣减失败，库存不足
      await transaction.rollback();
      await redis.set(`seckill:result:${userId}:${productId}`, JSON.stringify({ status: 'failed', message: '库存不足' }), 'EX', 3600);
      return;
    }

    // TODO: 生成订单逻辑 (这里简化，只记录结果)
    const orderId = `ORDER_${Date.now()}_${userId}`;
    
    await transaction.commit();

    // 写入成功结果
    await redis.set(`seckill:result:${userId}:${productId}`, JSON.stringify({ status: 'success', orderId }), 'EX', 3600);
    console.log(`Seckill success: User ${userId} Product ${productId} Order ${orderId}`);

  } catch (error) {
    await transaction.rollback();
    console.error('Seckill transaction error:', error);
    await redis.set(`seckill:result:${userId}:${productId}`, JSON.stringify({ status: 'failed', message: '系统异常' }), 'EX', 3600);
  }
};

module.exports = startConsumer;
