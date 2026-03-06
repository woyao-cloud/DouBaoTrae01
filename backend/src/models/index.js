const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  nickname: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  role: {
    type: DataTypes.SMALLINT,
    defaultValue: 2, // 1-Super Admin, 2-Admin
    allowNull: false
  },
  status: {
    type: DataTypes.SMALLINT,
    defaultValue: 1, // 1-Active, 0-Inactive
    allowNull: false
  }
}, {
  tableName: 'admins',
  timestamps: true,
  createdAt: 'create_time',
  updatedAt: 'update_time'
});

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  parent_id: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
    allowNull: false
  },
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
}, {
  tableName: 'product_categories',
  timestamps: true,
  createdAt: 'create_time',
  updatedAt: 'update_time'
});

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  product_code: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  category_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  cost_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  status: {
    type: DataTypes.SMALLINT,
    defaultValue: 1, // 1-On Shelf, 0-Off Shelf
    allowNull: false
  },
  is_promotion: {
    type: DataTypes.SMALLINT,
    defaultValue: 0, // 1-In Promotion, 0-No Promotion
    allowNull: false
  },
  promotion_stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  cover_image: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'create_time',
  updatedAt: 'update_time'
});

// Associations
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Product, { foreignKey: 'category_id' });

module.exports = {
  sequelize,
  Admin,
  Category,
  Product
};
