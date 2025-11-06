# Warehouse API

Backend API cho hệ thống Warehouse, được xây dựng với NestJS.

## 📋 Tổng quan

API cung cấp RESTful endpoints cho:

- Authentication & Authorization
- User Management
- Role Management
- Permission Management
- Health Check

## 🚀 Quick Start

### Development

```bash
# Install dependencies
yarn install

# Setup environment
cp .env.example .env
# Edit .env với thông tin database và Redis

# Run migrations
yarn migration:run

# Start development server
yarn dev
```

Server sẽ chạy tại `http://localhost:3001`

## 🏗️ Architecture

### Module Structure

API được tổ chức theo NestJS module pattern:

```
src/
├── app.module.ts           # Root module
├── main.ts                 # Bootstrap
├── database/               # Database configuration
├── redis/                  # Redis configuration
├── common/                 # Shared utilities
└── modules/                # Feature modules
    ├── auth/              # Authentication
    ├── users/             # User management
    ├── roles/             # Role management
    └── permissions/       # Permission management
```

### Key Features

#### 1. Authentication Module

- JWT-based authentication với refresh token mechanism
- Support cho Local và Google OAuth 2.0 strategies
- Token storage trong Redis
- Password reset functionality
- Facade pattern với Dependency Injection

**Architecture:**

- Controller → Facade → Service pattern
- Business logic separation (AuthService)
- Orchestration layer (AuthFacade)
- Interface-based password hashing

**Endpoints:**

- `POST /api/auth/register` - Đăng ký user mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại (protected)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/google` - Initiate Google OAuth flow (qua proxy)
- `GET /api/auth/google/callback` - Google OAuth callback (backend only, set cookie trực tiếp)
- `POST /api/auth/reset-password/request` - Yêu cầu reset password
- `POST /api/auth/reset-password` - Reset password với token

#### 2. Users Module

CRUD operations cho user management.

**Architecture:**

- Simple module structure (Controller → Service)
- Uses `PasswordHasher` interface (consistent with Auth module)
- TypeORM repository pattern

**Endpoints:**

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### 3. Roles Module

Quản lý roles và gán roles cho users.

**Endpoints:**

- `GET /api/roles` - List roles
- `GET /api/roles/:id` - Get role by ID
- `POST /api/roles` - Create role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

#### 4. Permissions Module

Quản lý permissions và gán permissions cho roles.

**Endpoints:**

- `GET /api/permissions` - List permissions
- `GET /api/permissions/:id` - Get permission by ID
- `POST /api/permissions` - Create permission
- `PUT /api/permissions/:id` - Update permission
- `DELETE /api/permissions/:id` - Delete permission

## 🔧 Configuration

### Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/warehouse_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

### Database Configuration

TypeORM được cấu hình trong `src/database/data-source.ts`:

- **Connection Pool**:
  - Production: min 2, max 10
  - Development: min 1, max 5
- **SSL**: Enabled trong production
- **Logging**: Enabled trong development

### Redis Configuration

Redis được sử dụng cho:

- Refresh token storage
- Session caching
- General caching

## 🗄️ Database Migrations

### Generate Migration

```bash
# Tự động generate từ entity changes
yarn migration:generate src/database/migrations/MigrationName

# Tạo migration trống
yarn migration:create src/database/migrations/MigrationName
```

### Run Migrations

```bash
# Chạy tất cả pending migrations
yarn migration:run

# Revert migration cuối cùng
yarn migration:revert
```

### Migration Best Practices

1. Luôn tạo migration từ entity changes
2. Review migration trước khi commit
3. Test migrations trên development trước
4. Backup database trước khi chạy migrations trên production

## 🔐 Authentication & Authorization

### JWT Strategy

API sử dụng Passport JWT strategy để verify tokens:

1. Client gửi `Authorization: Bearer <token>` header
2. JwtAuthGuard verify token
3. User information được inject vào `request.user`

### Guards

#### JwtAuthGuard

Protect routes yêu cầu authentication. Được apply globally trong `app.module.ts`, có thể bypass bằng `@Public()` decorator.

#### Usage

```typescript
// Protected route
@Get('protected')
@UseGuards(JwtAuthGuard)
getProtectedData() {
  return { message: 'This is protected' };
}

// Public route
@Public()
@Get('public')
getPublicData() {
  return { message: 'This is public' };
}
```

### Refresh Token Flow

1. Login/Register → Nhận access token (15 phút) và refresh token (7 ngày)
2. Refresh token được lưu trong Redis
3. Khi access token hết hạn → Gọi `/api/auth/refresh` với refresh token
4. Nhận access token mới
5. Logout → Invalidate refresh token trong Redis

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
yarn test

# Watch mode
yarn test:watch

# Coverage
yarn test:cov

# Specific test file
yarn test users.service.spec.ts
```

### E2E Tests

```bash
# Run e2e tests
yarn test:e2e

# Test specific file
yarn test:e2e test/users.e2e-spec.ts
```

### Test Structure

```
src/
├── modules/
│   ├── users/
│   │   ├── users.service.spec.ts      # Unit tests
│   │   └── users.controller.spec.ts   # Controller tests
└── test/
    ├── app.e2e-spec.ts                # App e2e tests
    ├── auth.e2e-spec.ts               # Auth e2e tests
    └── users.e2e-spec.ts              # Users e2e tests
```

## 📦 Dependencies

### Core Dependencies

- `@nestjs/common` - NestJS core
- `@nestjs/core` - NestJS core
- `@nestjs/config` - Configuration management
- `@nestjs/typeorm` - TypeORM integration
- `typeorm` - ORM
- `pg` - PostgreSQL driver
- `redis` - Redis client
- `@nestjs/jwt` - JWT utilities
- `@nestjs/passport` - Passport integration
- `passport-jwt` - JWT strategy
- `passport-local` - Local strategy
- `bcrypt` - Password hashing
- `class-validator` - Validation
- `class-transformer` - Transformation

### Dev Dependencies

- `@nestjs/cli` - NestJS CLI
- `@nestjs/testing` - Testing utilities
- `jest` - Testing framework
- `ts-jest` - TypeScript Jest preset
- `supertest` - HTTP assertions
- `typescript` - TypeScript
- `eslint` - Linting
- `prettier` - Code formatting

## 🚢 Deployment

### Build

```bash
yarn build
```

Build output sẽ ở trong `dist/` folder.

### Production Start

```bash
yarn start:prod
```

### Health Check

API có health check endpoint tại `/api/health`:

```bash
curl http://localhost:3001/api/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📝 Best Practices

### Code Organization

1. **Modules**: Mỗi feature có một module riêng
2. **Services**: Business logic trong services
3. **Controllers**: Chỉ handle HTTP requests/responses
4. **DTOs**: Data Transfer Objects cho validation
5. **Entities**: Database entities với TypeORM

### Error Handling

- Sử dụng NestJS built-in exceptions
- Custom exceptions cho business logic errors
- Validation errors tự động từ class-validator

### Security

- Passwords được hash với bcrypt
- JWT tokens với secure secrets
- Refresh tokens stored trong Redis
- CORS configuration (nếu cần)
- Input validation với class-validator

## 🔍 Debugging

### Debug Mode

```bash
yarn start:debug
```

### Logging

- Development: Console logging enabled
- Production: Disable sensitive logging

### Common Debug Points

1. Database queries: Check TypeORM logging
2. Authentication: Check JWT token validity
3. Redis: Check connection và token storage

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/docs/)
