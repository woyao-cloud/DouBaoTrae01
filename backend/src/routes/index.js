const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const seckillController = require('../controllers/seckillController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: 管理员管理接口
 *   - name: Product
 *     description: 商品管理接口
 *   - name: Category
 *     description: 分类管理接口
 *   - name: Seckill
 *     description: 秒杀管理接口
 */

// Admin Routes

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: 管理员登录
 *     tags: [Admin]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     userInfo:
 *                       type: object
 */
router.post('/admin/login', adminController.login);

/**
 * @swagger
 * /admin/profile:
 *   get:
 *     summary: 获取当前管理员信息
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/admin/profile', authMiddleware, adminController.getProfile);

/**
 * @swagger
 * /admin/list:
 *   get:
 *     summary: 获取管理员列表
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/admin/list', authMiddleware, adminController.list);

/**
 * @swagger
 * /admin/create:
 *   post:
 *     summary: 创建管理员
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - nickname
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               nickname:
 *                 type: string
 *               role:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 创建成功
 */
router.post('/admin/create', authMiddleware, adminController.create);

/**
 * @swagger
 * /admin/{id}:
 *   put:
 *     summary: 更新管理员信息
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *               role:
 *                 type: integer
 *               status:
 *                 type: integer
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 更新成功
 */
router.put('/admin/:id', authMiddleware, adminController.update);

// Product Routes

/**
 * @swagger
 * /products:
 *   get:
 *     summary: 获取商品列表
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: product_code
 *         schema:
 *           type: string
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/products', authMiddleware, productController.list);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: 创建商品
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_code
 *               - name
 *               - category_id
 *               - price
 *               - cost_price
 *             properties:
 *               product_code:
 *                 type: string
 *               name:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               price:
 *                 type: number
 *               cost_price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               description:
 *                 type: string
 *               cover_image:
 *                 type: string
 *               status:
 *                 type: integer
 *               is_promotion:
 *                 type: integer
 *               promotion_stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 创建成功
 */
router.post('/products', authMiddleware, productController.create);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: 更新商品
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_code:
 *                 type: string
 *               name:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               price:
 *                 type: number
 *               cost_price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               description:
 *                 type: string
 *               cover_image:
 *                 type: string
 *               status:
 *                 type: integer
 *               is_promotion:
 *                 type: integer
 *               promotion_stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 更新成功
 */
router.put('/products/:id', authMiddleware, productController.update);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: 删除商品
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 删除成功
 */
router.delete('/products/:id', authMiddleware, productController.remove);

/**
 * @swagger
 * /products/{id}/status:
 *   patch:
 *     summary: 更新商品状态
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: integer
 *                 enum: [0, 1]
 *     responses:
 *       200:
 *         description: 状态更新成功
 */
router.patch('/products/:id/status', authMiddleware, productController.updateStatus);

// Category Routes

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: 获取分类树
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/categories', authMiddleware, categoryController.list);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: 创建分类
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               parent_id:
 *                 type: integer
 *               sort:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 创建成功
 */
router.post('/categories', authMiddleware, categoryController.create);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: 更新分类
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               parent_id:
 *                 type: integer
 *               sort:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 更新成功
 */
router.put('/categories/:id', authMiddleware, categoryController.update);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: 删除分类
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 删除成功
 */
router.delete('/categories/:id', authMiddleware, categoryController.remove);

// Seckill Routes

/**
 * @swagger
 * /seckill/create:
 *   post:
 *     summary: 发起秒杀请求
 *     tags: [Seckill]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 秒杀请求已受理
 */
router.post('/seckill/create', authMiddleware, seckillController.create);

/**
 * @swagger
 * /seckill/result:
 *   get:
 *     summary: 查询秒杀结果
 *     tags: [Seckill]
 *     parameters:
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 查询成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       description: success, failed, processing, pending
 *                     orderId:
 *                       type: string
 *                     message:
 *                       type: string
 */
router.get('/seckill/result', authMiddleware, seckillController.getResult);

module.exports = router;
