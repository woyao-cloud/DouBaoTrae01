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

## 高并发秒杀功能 (Seckill)

本项目实现了基于 **Redis 消息队列 + 乐观锁** 的高并发秒杀方案。

### 架构说明

1.  **Redis 预扣减**: 秒杀请求到达时，优先在 Redis 中扣减库存 (`DECR`)，减少数据库压力。
2.  **异步队列**: 扣减成功的请求推入 Redis List (`LPUSH`)，实现削峰填谷。
3.  **乐观锁扣库**: 后端消费者进程从队列取出请求，使用 PostgreSQL 乐观锁 (`promotion_stock > 0`) 最终扣减数据库库存。
4.  **结果轮询**: 前端通过轮询接口获取秒杀结果。

### 压测指南

推荐使用 `ab` (Apache Bench) 或 `wrk` 进行压测。

**场景**: 10000 个请求并发抢购 ID 为 1 的商品。

```bash
# 需先登录获取 Token，并在 Header 中携带
# Authorization: Bearer <YOUR_TOKEN>

ab -n 10000 -c 100 \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -p post_data.json \
  http://localhost:3000/api/seckill/create
```

*注: `post_data.json` 内容为 `{"productId": 1}`*

### 性能对比预期

| 方案 | 吞吐量 (RPS) | 瓶颈 |
| :--- | :--- | :--- |
| **悲观锁 (FOR UPDATE)** | 低 (< 100) | 数据库行锁竞争严重，大量请求阻塞 |
| **Redis + 队列 + 乐观锁** | 高 (> 2000) | Redis 性能极高，数据库压力被队列缓冲 |

## 注意事项

- 数据库连接配置位于 `backend/.env`，默认配置适配 docker-compose 设置。
- 前端 API 代理配置位于 `frontend/vite.config.js`。
