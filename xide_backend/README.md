# Xide 区块链教育平台后端 API 系统

## 项目简介

Xide 是一个基于 Node.js 和 SQLite 构建的区块链教育平台后端 API 系统，采用 RESTful 架构设计，为前端应用提供完整的课程管理、用户管理和积分系统服务。

## 功能特性

### 🎓 课程管理

- **课程创建**: 后台管理员可创建直播课程
- **课程信息**: 包含标题、讲师、价值、评分、上架时间、直播时间、类别等
- **课程查询**: 支持分页、分类筛选、搜索等功能
- **课程状态**: 支持上架、下架、删除等状态管理

### 👤 用户管理

- **Web3 钱包集成**: 使用钱包 ID 作为用户唯一标识
- **用户信息**: 记录用户名、邮箱、头像等基本信息
- **课程参与**: 用户可加入课程并记录学习进度
- **学习统计**: 跟踪观看时间、完成率等学习数据

### 💰 积分系统

- **积分获取**: 完成课程、参与活动等获得积分
- **积分消费**: 购买课程、兑换商品等消费积分
- **积分日志**: 完整的积分变动记录和审计
- **积分统计**: 详细的积分收支统计和趋势分析

## 技术架构

- **运行环境**: Node.js
- **Web 框架**: Express.js
- **数据库**: SQLite3
- **数据验证**: Joi
- **安全防护**: Helmet, CORS, Rate Limiting
- **日志记录**: Morgan

## 数据库设计

### 核心表结构

#### courses (课程表)

- `id`: 主键
- `title`: 课程标题
- `instructor`: 讲师姓名
- `value`: 课程价值
- `rating`: 评分
- `rating_count`: 评分人数
- `publish_time`: 上架时间
- `live_time`: 直播时间
- `category`: 课程类别
- `description`: 课程描述
- `cover_image`: 封面图片
- `status`: 课程状态
- `created_at`: 创建时间
- `updated_at`: 更新时间

#### users (用户表)

- `id`: 主键
- `wallet_id`: Web3 钱包 ID (唯一)
- `username`: 用户名
- `email`: 邮箱
- `avatar`: 头像
- `total_points`: 总积分
- `created_at`: 创建时间
- `updated_at`: 更新时间

#### user_courses (用户课程记录表)

- `id`: 主键
- `user_id`: 用户 ID (外键)
- `course_id`: 课程 ID (外键)
- `watch_time`: 观看时间(秒)
- `completion_rate`: 完成率(%)
- `points_earned`: 获得的积分
- `joined_at`: 加入时间

#### points_logs (积分日志表)

- `id`: 主键
- `user_id`: 用户 ID (外键)
- `course_id`: 课程 ID (外键，可选)
- `points_change`: 积分变动 (+获得/-消费)
- `reason`: 变动原因
- `balance_after`: 变动后余额
- `created_at`: 创建时间

## API 接口文档

### 课程相关接口

#### 获取课程列表

```
GET /api/courses
查询参数:
- page: 页码 (默认: 1)
- limit: 每页数量 (默认: 10)
- category: 课程类别
- status: 课程状态 (默认: active)
- search: 搜索关键词
```

#### 获取课程详情

```
GET /api/courses/:id
```

#### 创建课程 (后台管理)

```
POST /api/courses
请求体:
{
  "title": "课程标题",
  "instructor": "讲师姓名",
  "value": 100.0,
  "live_time": "2024-01-15T10:00:00Z",
  "category": "区块链基础",
  "description": "课程描述",
  "cover_image": "https://example.com/image.jpg"
}
```

#### 更新课程

```
PUT /api/courses/:id
```

#### 删除课程

```
DELETE /api/courses/:id
```

#### 获取课程类别

```
GET /api/courses/categories
```

### 用户相关接口

#### 创建用户

```
POST /api/users
请求体:
{
  "wallet_id": "0x1234567890abcdef...",
  "username": "用户名",
  "email": "user@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### 获取用户信息

```
GET /api/users/:wallet_id
```

#### 更新用户信息

```
PUT /api/users/:wallet_id
```

#### 用户加入课程

```
POST /api/users/:wallet_id/join-course
请求体:
{
  "course_id": 1
}
```

#### 获取用户课程列表

```
GET /api/users/:wallet_id/courses
查询参数:
- page: 页码
- limit: 每页数量
```

#### 更新学习进度

```
PUT /api/users/:wallet_id/courses/:course_id/progress
请求体:
{
  "watch_time": 3600,
  "completion_rate": 75.5
}
```

### 积分相关接口

#### 获取用户积分余额

```
GET /api/points/:wallet_id
```

#### 用户获得积分

```
POST /api/points/:wallet_id/earn
请求体:
{
  "points": 100,
  "reason": "完成课程学习",
  "course_id": 1
}
```

#### 用户消费积分

```
POST /api/points/:wallet_id/spend
请求体:
{
  "points": 50,
  "reason": "购买高级课程",
  "course_id": 2
}
```

#### 获取积分日志

```
GET /api/points/:wallet_id/logs
查询参数:
- page: 页码
- limit: 每页数量
- type: 类型 (earn/spend)
```

#### 获取积分统计

```
GET /api/points/:wallet_id/statistics
```

## 安装和运行

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖

```bash
npm install
```

### 环境配置

复制 `config.env` 文件并根据需要修改配置：

```bash
cp config.env .env
```

### 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

### 健康检查

访问 `http://localhost:10086/health` 检查服务状态

## 开发指南

### 项目结构

```
xide_backend/
├── database/          # 数据库相关
│   └── database.js    # 数据库连接和初始化
├── middleware/        # 中间件
│   └── validation.js  # 数据验证
├── routes/            # 路由文件
│   ├── courseRoutes.js    # 课程路由
│   ├── userRoutes.js      # 用户路由
│   └── pointsRoutes.js    # 积分路由
├── uploads/           # 文件上传目录
├── config.env         # 环境配置
├── package.json       # 项目配置
├── server.js          # 主服务器文件
└── README.md          # 项目说明
```

### 添加新功能

1. 在 `database/database.js` 中添加新的数据表
2. 创建对应的路由文件
3. 在 `server.js` 中注册新路由
4. 添加必要的数据验证

### 测试

```bash
npm test
```

## 安全特性

- **输入验证**: 使用 Joi 进行严格的数据验证
- **SQL 注入防护**: 使用参数化查询
- **CORS 配置**: 限制跨域请求
- **请求限制**: 防止 API 滥用
- **安全头**: 使用 Helmet 增强安全性

## 部署说明

### 生产环境配置

1. 设置 `NODE_ENV=production`
2. 配置安全的 JWT 密钥
3. 设置适当的 CORS 域名
4. 配置数据库路径
5. 设置合理的请求限制

### Docker 部署

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

- 项目维护者: Xide Team
- 邮箱: support@xide.com
- 项目地址: https://github.com/xide/xide_backend

## 更新日志

### v1.0.0 (2024-01-01)

- 初始版本发布
- 实现基础的课程管理功能
- 实现用户管理系统
- 实现积分系统
- 完整的 RESTful API
