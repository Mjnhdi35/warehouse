# Warehouse Project

Dự án Warehouse là một monorepo full-stack được xây dựng với NestJS (backend) và Nuxt.js (frontend), cung cấp hệ thống quản lý kho với các tính năng xác thực, phân quyền, và quản lý người dùng.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Kiến trúc](#kiến-trúc)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt và cấu hình](#cài-đặt-và-cấu-hình)
- [Hướng dẫn phát triển](#hướng-dẫn-phát-triển)
- [API Documentation](#api-documentation)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Database](#database)
- [Authentication](#authentication)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Tổng quan

Warehouse là một hệ thống quản lý kho với các tính năng chính:

- **Backend API**: RESTful API được xây dựng với NestJS
- **Frontend Web**: Ứng dụng web được xây dựng với Nuxt.js 4
- **Authentication & Authorization**: JWT-based authentication với refresh token
- **Database**: PostgreSQL với TypeORM
- **Caching**: Redis cho session và caching
- **Role-Based Access Control (RBAC)**: Quản lý quyền truy cập theo vai trò

## 🏗️ Kiến trúc

```
warehouse/
├── apps/
│   ├── api/          # NestJS Backend API
│   └── web/          # Nuxt.js Frontend Application
├── packages/         # Shared packages (hiện tại chưa có)
├── docs/             # Tài liệu dự án
├── scripts/          # Utility scripts
└── package.json      # Root workspace configuration
```

### Monorepo Structure

Dự án sử dụng Yarn Workspaces để quản lý monorepo, cho phép:

- Chia sẻ dependencies giữa các packages
- Quản lý version tập trung
- Build và deploy độc lập

## 🛠️ Công nghệ sử dụng

### Backend (API)

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.9.x
- **ORM**: TypeORM 0.3.x
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: Passport.js (JWT, Local, Google OAuth)
- **Validation**: class-validator, class-transformer
- **Testing**: Jest

### Frontend (Web)

- **Framework**: Nuxt.js 4.x
- **UI Framework**: Nuxt UI 4.x
- **Language**: TypeScript 5.9.x
- **Styling**: Tailwind CSS 4.x
- **Icons**: Nuxt Icon
- **Validation**: Zod 4.x
- **Build Tool**: Vite 7.x

### Development Tools

- **Package Manager**: Yarn 4.10.3
- **Monorepo**: Yarn Workspaces
- **Linting**: ESLint
- **Formatting**: Prettier
- **Task Runner**: Nx (cho các task phức tạp)

## 📦 Yêu cầu hệ thống

- **Node.js**: 22.16.0 (được chỉ định trong engines)
- **Yarn**: 4.10.3 (được quản lý bởi Corepack)
- **PostgreSQL**: 12+ (cho production)
- **Redis**: 6+ (cho caching và session)

## 🚀 Cài đặt và cấu hình

### 1. Clone repository

```bash
git clone https://github.com/Mjnhdi35/warehouse.git
cd warehouse
```

### 2. Enable Corepack

```bash
corepack enable
```

Corepack sẽ tự động sử dụng đúng version Yarn được chỉ định trong `package.json`.

### 3. Cài đặt dependencies

```bash
yarn install
```

### 4. Cấu hình môi trường

#### Backend API

Tạo file `.env` trong `apps/api/`:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/warehouse_db

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```

#### Frontend Web

Tạo file `.env` trong `apps/web/` (nếu cần):

```env
# API URL
API_URL=http://localhost:3001/api
```

### 5. Setup Database

```bash
# Chạy migrations
cd apps/api
yarn migration:run
```

### 6. Khởi chạy ứng dụng

```bash
# Development mode (từ root)
yarn workspace @warehouse/api dev
yarn workspace @warehouse/web dev
```

Hoặc chạy riêng lẻ:

```bash
# Backend API (port 3001)
cd apps/api
yarn dev

# Frontend Web (port 3000)
cd apps/web
yarn dev
```

## 💻 Hướng dẫn phát triển

### Scripts có sẵn

#### Root level

```bash
yarn format          # Format code với Prettier
yarn format:check    # Check formatting
yarn tsc             # Type check toàn bộ monorepo
yarn lint            # Lint toàn bộ monorepo
yarn build           # Build toàn bộ monorepo
yarn valid           # Chạy format, tsc, lint, build
```

#### API (apps/api)

```bash
yarn dev              # Development mode với watch
yarn build            # Build production
yarn start            # Start production server
yarn start:debug      # Start với debug mode
yarn test             # Chạy unit tests
yarn test:e2e         # Chạy e2e tests
yarn test:cov         # Test với coverage
yarn lint             # Lint code
yarn tsc              # Type check

# Database migrations
yarn migration:generate <MigrationName>  # Generate migration
yarn migration:run                       # Run migrations
yarn migration:revert                    # Revert last migration
yarn migration:create <MigrationName>    # Create empty migration
```

#### Web (apps/web)

```bash
yarn dev              # Development server
yarn build            # Build production
yarn generate         # Generate static site
yarn preview          # Preview production build
yarn start            # Start production server
yarn lint             # Lint code
yarn tsc              # Type check
```

### Workspace Commands

```bash
# Chạy command trong workspace cụ thể
yarn workspace @warehouse/api <command>
yarn workspace @warehouse/web <command>

# Ví dụ
yarn workspace @warehouse/api test
yarn workspace @warehouse/web build
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured với Nuxt ESLint config cho web, NestJS ESLint cho API
- **Prettier**: Format code tự động
- **Conventions**:
  - PascalCase cho classes, interfaces, types
  - camelCase cho variables, functions
  - kebab-case cho files

## 📡 API Documentation

### Base URL

```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

### Authentication

API sử dụng JWT Bearer token authentication. Tất cả endpoints (trừ public) yêu cầu header:

```
Authorization: Bearer <access_token>
```

### Endpoints

#### Authentication

##### POST /auth/register

Đăng ký user mới

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

##### POST /auth/login

Đăng nhập

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

##### GET /auth/me

Lấy thông tin user hiện tại (yêu cầu authentication)

**Response:**

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

##### POST /auth/refresh

Refresh access token

**Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

##### POST /auth/logout

Đăng xuất (invalidate refresh token)

**Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "success": true
}
```

#### Users

##### GET /users

Lấy danh sách users (yêu cầu authentication)

##### GET /users/:id

Lấy thông tin user cụ thể

##### PUT /users/:id

Cập nhật user

##### DELETE /users/:id

Xóa user

#### Roles

##### GET /roles

Lấy danh sách roles

##### POST /roles

Tạo role mới

##### GET /roles/:id

Lấy thông tin role

##### PUT /roles/:id

Cập nhật role

##### DELETE /roles/:id

Xóa role

#### Permissions

##### GET /permissions

Lấy danh sách permissions

##### POST /permissions

Tạo permission mới

##### GET /permissions/:id

Lấy thông tin permission

##### PUT /permissions/:id

Cập nhật permission

##### DELETE /permissions/:id

Xóa permission

#### Health Check

##### GET /health

Health check endpoint

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📁 Cấu trúc dự án

### Backend API Structure

```
apps/api/
├── src/
│   ├── app.module.ts              # Root module
│   ├── main.ts                    # Application entry point
│   ├── database/
│   │   ├── data-source.ts         # TypeORM configuration
│   │   ├── database.module.ts     # Database module
│   │   ├── database.service.ts    # Database service
│   │   └── migrations/            # Database migrations
│   ├── redis/
│   │   ├── redis.config.ts        # Redis configuration
│   │   ├── redis.module.ts        # Redis module
│   │   └── redis.service.ts       # Redis service
│   ├── common/                    # Shared utilities
│   │   ├── base/entities/         # Base entities
│   │   ├── constants/             # Constants
│   │   ├── decorators/            # Custom decorators (Public, etc.)
│   │   ├── health/                # Health check module
│   │   ├── interfaces/            # Shared interfaces
│   │   ├── services/              # Shared services
│   │   ├── types/                 # Shared types
│   │   └── utils/                 # Utility functions
│   └── modules/                   # Feature modules
│       ├── auth/                  # Authentication module
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── auth.facade.ts
│       │   ├── dtos/              # Data Transfer Objects
│       │   ├── guards/            # Auth guards
│       │   ├── strategies/        # Passport strategies
│       │   └── refresh-token.store.ts
│       ├── users/                 # Users module
│       ├── roles/                 # Roles module
│       └── permissions/           # Permissions module
├── test/                          # E2E tests
├── dist/                          # Build output
├── package.json
└── tsconfig.json
```

### Frontend Web Structure

```
apps/web/
├── app/
│   ├── app.vue                    # Root component
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css           # Global styles
│   │   └── images/                # Images
│   ├── layouts/
│   │   ├── default.vue            # Default layout
│   │   ├── admin.vue              # Admin layout
│   │   └── auth.vue               # Auth layout
│   └── pages/
│       ├── index.vue              # Home page
│       ├── admin/                 # Admin pages
│       └── auth/                  # Auth pages
├── server/
│   ├── api/                       # Server API routes
│   ├── middleware/                # Server middleware
│   └── plugins/                   # Server plugins
├── public/                        # Static files
├── nuxt.config.ts                 # Nuxt configuration
├── package.json
└── tsconfig.json
```

## 🗄️ Database

### TypeORM Configuration

Database được cấu hình trong `apps/api/src/database/data-source.ts`:

- **Type**: PostgreSQL
- **Connection**: Thông qua `DATABASE_URL` environment variable
- **Migrations**: Tự động load từ `src/database/migrations/`
- **Entities**: Tự động load từ `src/**/*.entity.ts`

### Migrations

```bash
# Generate migration từ entity changes
yarn migration:generate -n MigrationName

# Tạo migration trống
yarn migration:create -n MigrationName

# Chạy migrations
yarn migration:run

# Revert migration cuối cùng
yarn migration:revert
```

### Entities

- **User**: Thông tin người dùng
- **Role**: Vai trò người dùng
- **Permission**: Quyền truy cập
- **BaseEntity**: Base entity với timestamps

## 🔐 Authentication

### JWT Authentication

Hệ thống sử dụng JWT với 2 loại tokens:

1. **Access Token**: Short-lived (15 phút), được dùng để authenticate requests
2. **Refresh Token**: Long-lived (7 ngày), được dùng để refresh access token

### Authentication Flow

1. User đăng nhập → Nhận access token và refresh token
2. Access token được gửi trong header `Authorization: Bearer <token>`
3. Khi access token hết hạn → Dùng refresh token để lấy access token mới
4. Refresh token được lưu trong Redis và có thể invalidate khi logout

### Guards

- **JwtAuthGuard**: Protect routes yêu cầu authentication
- **Public Decorator**: Đánh dấu routes public (không cần auth)

### Strategies

- **JWT Strategy**: Verify JWT tokens
- **Local Strategy**: Email/password authentication
- **Google Strategy**: Google OAuth (optional)

## 🧪 Testing

### Backend Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Coverage
yarn test:cov

# Watch mode
yarn test:watch
```

### Frontend Testing

Frontend testing có thể được setup với Vitest hoặc Playwright (chưa được cấu hình).

## 🚢 Deployment

### Render.com Deployment

#### Web Service (Nuxt.js)

**Build Settings:**

- **Build Command**: `yarn install && yarn workspace @warehouse/web build`
- **Start Command**: `yarn workspace @warehouse/web start`
- **Node Version**: 22.16.0
- **Environment**: Node

**Environment Variables:**

```env
NODE_ENV=production
API_URL=https://your-api-url.com/api
```

#### API Service (NestJS)

**Build Settings:**

- **Build Command**: `yarn install && yarn workspace @warehouse/api build`
- **Start Command**: `yarn workspace @warehouse/api start:prod`
- **Node Version**: 22.16.0
- **Environment**: Node

**Environment Variables:**

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=<production-database-url>
REDIS_URL=<production-redis-url>
JWT_SECRET=<production-jwt-secret>
JWT_REFRESH_SECRET=<production-refresh-secret>
```

### Manual Deployment

```bash
# Build
yarn build

# Start production server
# API
cd apps/api
yarn start:prod

# Web
cd apps/web
yarn start
```

### Docker Deployment (Optional)

Có thể tạo Dockerfile cho từng service:

```dockerfile
# API Dockerfile example
FROM node:22.16.0-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile
COPY . .
RUN yarn workspace @warehouse/api build
CMD ["yarn", "workspace", "@warehouse/api", "start:prod"]
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Yarn version mismatch

```bash
# Enable Corepack
corepack enable

# Check version
yarn --version
```

#### 2. Database connection errors

- Kiểm tra `DATABASE_URL` trong `.env`
- Đảm bảo PostgreSQL đang chạy
- Kiểm tra network và firewall

#### 3. Redis connection errors

- Kiểm tra `REDIS_URL` trong `.env`
- Đảm bảo Redis đang chạy
- Kiểm tra network và firewall

#### 4. Port already in use

```bash
# Find process using port
lsof -i :3000  # hoặc port khác

# Kill process
kill -9 <PID>
```

#### 5. Peer dependency warnings

Một số peer dependency warnings là bình thường và không ảnh hưởng đến ứng dụng. Để xem chi tiết:

```bash
yarn explain peer-requirements
```

### Debug Mode

```bash
# API debug mode
cd apps/api
yarn start:debug
```

### Logs

- API logs: Console output
- Web logs: Console output và browser DevTools

## 📚 Tài liệu tham khảo

- [NestJS Documentation](https://docs.nestjs.com/)
- [Nuxt.js Documentation](https://nuxt.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Yarn Workspaces](https://yarnpkg.com/features/workspaces)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 📝 License

UNLICENSED - Private project

## 👥 Contributors

- **Smoothie** - Author

---

**Lưu ý**: Đây là tài liệu đang được cập nhật. Vui lòng đóng góp để cải thiện tài liệu này.
