const { Product, Category } = require('../models');
const Joi = require('joi');
const { Op } = require('sequelize');

const list = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, name, product_code, category_id, status } = req.query;
    const offset = (page - 1) * pageSize;
    
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (product_code) where.product_code = { [Op.like]: `%${product_code}%` };
    if (category_id) where.category_id = category_id;
    if (status !== undefined) where.status = status;

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['name'] }],
      limit: parseInt(pageSize),
      offset: parseInt(offset),
      order: [['create_time', 'DESC']]
    });

    res.json({
      code: 200,
      data: {
        list: rows,
        total: count,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const schema = Joi.object({
      product_code: Joi.string().required(),
      name: Joi.string().required(),
      category_id: Joi.number().required(),
      price: Joi.number().required(),
      cost_price: Joi.number().required(),
      stock: Joi.number().integer().min(0).default(0),
      description: Joi.string().allow('').optional(),
      cover_image: Joi.string().allow('').optional(),
      status: Joi.number().valid(0, 1).default(1)
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ code: 400, message: error.details[0].message });

    const product = await Product.create(req.body);
    res.json({ code: 200, message: '创建成功', data: product });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ code: 404, message: '商品不存在' });

    await product.update(req.body);
    res.json({ code: 200, message: '更新成功', data: product });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ code: 404, message: '商品不存在' });

    await product.destroy();
    res.json({ code: 200, message: '删除成功' });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (![0, 1].includes(status)) {
      return res.status(400).json({ code: 400, message: '状态值无效' });
    }

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ code: 404, message: '商品不存在' });

    product.status = status;
    await product.save();
    res.json({ code: 200, message: '状态更新成功' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  list,
  create,
  update,
  remove,
  updateStatus
};
