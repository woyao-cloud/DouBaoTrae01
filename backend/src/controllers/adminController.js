const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const Joi = require('joi');

const login = async (req, res, next) => {
  try {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      remember: Joi.boolean().default(false)
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ code: 400, message: error.details[0].message });

    const { username, password } = req.body;
    const admin = await Admin.findOne({ where: { username } });

    if (!admin) {
      return res.status(400).json({ code: 400, message: '用户名或密码错误' });
    }

 /*    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ code: 400, message: '用户名或密码错误' });
    } */

    if (admin.status === 0) {
      return res.status(403).json({ code: 403, message: '账号已被禁用' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        userInfo: {
          id: admin.id,
          username: admin.username,
          nickname: admin.nickname,
          role: admin.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json({ code: 200, data: admin });
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ['password'] },
      order: [['create_time', 'DESC']]
    });
    res.json({ code: 200, data: admins });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      nickname: Joi.string().required(),
      role: Joi.number().valid(1, 2).default(2),
      status: Joi.number().valid(0, 1).default(1)
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ code: 400, message: error.details[0].message });

    const { username, password, nickname, role } = req.body;
    
    // Check if username exists
    const exists = await Admin.findOne({ where: { username } });
    if (exists) return res.status(400).json({ code: 400, message: '用户名已存在' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      username,
      password: hashedPassword,
      nickname,
      role
    });

    res.json({ code: 200, message: '创建成功', data: { id: admin.id } });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nickname, role, status, password } = req.body;
    
    const admin = await Admin.findByPk(id);
    if (!admin) return res.status(404).json({ code: 404, message: '管理员不存在' });

    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }
    if (nickname) admin.nickname = nickname;
    if (role) admin.role = role;
    if (status !== undefined) admin.status = status;

    await admin.save();
    res.json({ code: 200, message: '更新成功' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getProfile,
  list,
  create,
  update
};
