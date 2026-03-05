# 商品后台管理系统 (Product Management System)

基于 React 18 + Node.js + PostgreSQL 的生产级后台管理系统。

## 目录结构

```
.
├── backend         # 后端工程 (Node.js + Express + Sequelize)
├── frontend        # 前端工程 (React + Vite + Ant Design)
├── docker          # Docker 部署配置
└── sql             # 数据库初始化脚本
```

## 技术栈

- **前端**: React 18, React Router 6, Ant Design 5, Vite, Axios
- **后端**: Node.js, Express, Sequelize ORM, JWT, Bcrypt
- **数据库**: PostgreSQL 16

## 快速开始

### 1. 环境要求

- Node.js >= 18
- Docker & Docker Compose

### 2. 启动数据库

进入 `docker` 目录并启动 PostgreSQL 容器：

```bash
cd docker
docker-compose up -d
```

该命令会自动：
- 启动 PostgreSQL 16 数据库
- 执行 `sql/schema.sql` 创建表结构
- 执行 `sql/data.sql` 插入初始化数据

### 3. 后端启动

进入 `backend` 目录：

```bash
cd backend
npm install
npm run dev
```

后端服务将运行在 `http://localhost:3000`。

### 4. 前端启动

进入 `frontend` 目录：

```bash
cd frontend
npm install
npm run dev
```

前端服务将运行在 `http://localhost:5173`。

## 测试账号

- **用户名**: admin
- **密码**: 123456

## 功能模块

1. **商品管理**
   - 商品列表（分页、搜索、筛选）
   - 商品新增/编辑/删除
   - 商品上下架

2. **分类管理**
   - 多级分类树形展示
   - 分类新增/编辑/删除

3. **系统管理**
   - 管理员账号管理
   - 权限控制（超级管理员/普通管理员）

## 注意事项

- 数据库连接配置位于 `backend/.env`，默认配置适配 docker-compose 设置。
- 前端 API 代理配置位于 `frontend/vite.config.js`。
