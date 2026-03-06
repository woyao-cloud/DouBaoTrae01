const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '商品后台管理系统 API',
      version: '1.0.0',
      description: '商品后台管理系统接口文档，包含商品管理、分类管理、系统管理、秒杀功能等。',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: '本地开发环境',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            code: {
              type: 'integer',
              description: '状态码',
            },
            message: {
              type: 'string',
              description: '错误信息',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // 指定含有 Swagger 注释的文件路径
};

const specs = swaggerJsdoc(options);

module.exports = specs;
