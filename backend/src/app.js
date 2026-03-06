const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { sequelize } = require('./models');
const initSeckillStock = require('./utils/initSeckill');
const startConsumer = require('./utils/seckillConsumer');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'http://your-production-domain.com' : '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }', // 隐藏顶部 Logo 栏
  customSiteTitle: "API 文档 - 商品后台管理系统"
}));

// Routes
app.use('/api', routes);

// Error Handler
app.use(errorHandler);

// Database Sync & Server Start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');
    
    // Sync models (in production, use migrations instead of sync)
    // await sequelize.sync({ alter: true }); 
    
    // Initialize Seckill Stock
    await initSeckillStock();
    
    // Start Seckill Consumer
    startConsumer();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
