const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const seckillController = require('../controllers/seckillController');
const authMiddleware = require('../middleware/auth');

// Admin Routes
router.post('/admin/login', adminController.login);
router.get('/admin/profile', authMiddleware, adminController.getProfile);
router.get('/admin/list', authMiddleware, adminController.list);
router.post('/admin/create', authMiddleware, adminController.create);
router.put('/admin/:id', authMiddleware, adminController.update);

// Product Routes
router.get('/products', authMiddleware, productController.list);
router.post('/products', authMiddleware, productController.create);
router.put('/products/:id', authMiddleware, productController.update);
router.delete('/products/:id', authMiddleware, productController.remove);
router.patch('/products/:id/status', authMiddleware, productController.updateStatus);

// Category Routes
router.get('/categories', authMiddleware, categoryController.list);
router.post('/categories', authMiddleware, categoryController.create);
router.put('/categories/:id', authMiddleware, categoryController.update);
router.delete('/categories/:id', authMiddleware, categoryController.remove);

// Seckill Routes
router.post('/seckill/create', authMiddleware, seckillController.create);
router.get('/seckill/result', authMiddleware, seckillController.getResult);

module.exports = router;
