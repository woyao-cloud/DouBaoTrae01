const { Category } = require('../models');
const Joi = require('joi');

const list = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      order: [['sort', 'DESC'], ['id', 'ASC']]
    });

    // Convert flat list to tree
    const buildTree = (items, parentId = 0) => {
      return items
        .filter(item => item.parent_id == parentId) // loose equality for string/number match
        .map(item => ({
          ...item.toJSON(),
          children: buildTree(items, item.id)
        }));
    };

    const tree = buildTree(categories);
    res.json({ code: 200, data: tree });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      parent_id: Joi.number().default(0),
      sort: Joi.number().default(0)
    });
    
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ code: 400, message: error.details[0].message });

    const category = await Category.create(req.body);
    res.json({ code: 200, message: '创建成功', data: category });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ code: 404, message: '分类不存在' });

    await category.update(req.body);
    res.json({ code: 200, message: '更新成功', data: category });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if has children
    const children = await Category.count({ where: { parent_id: id } });
    if (children > 0) {
      return res.status(400).json({ code: 400, message: '请先删除子分类' });
    }

    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ code: 404, message: '分类不存在' });

    await category.destroy();
    res.json({ code: 200, message: '删除成功' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  list,
  create,
  update,
  remove
};
