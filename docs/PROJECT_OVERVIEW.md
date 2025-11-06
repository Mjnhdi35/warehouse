# Project Overview

## Tổng quan

Warehouse là một monorepo full-stack được xây dựng với NestJS (backend) và Nuxt.js (frontend), cung cấp hệ thống quản lý kho với các tính năng xác thực, phân quyền, và quản lý người dùng.

## Kiến trúc

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

## Công nghệ sử dụng

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

## Tính năng chính

### Authentication & Authorization

- JWT-based authentication với refresh token mechanism
- Google OAuth 2.0 support
- Password reset functionality
- Role-Based Access Control (RBAC)

### API Proxy

- Server-side proxy để ẩn backend URL
- OAuth redirect handling
- Security headers forwarding

### Frontend Features

- Authentication pages (Login, Register, OAuth callback)
- Reusable components (Logo, Header, Footer)
- Composable-based architecture (useAuth, useApi, useForm)
- Responsive design với Tailwind CSS

## Cấu trúc dự án

Xem [API README](../apps/api/README.md) và [Web README](../apps/web/README.md) để biết chi tiết về cấu trúc từng app.

## Tài liệu

- [Backend Tech Stack](./BACKEND_TECH_STACK.md) - NestJS, TypeORM, Redis
- [Frontend Tech Stack](./FRONTEND_TECH_STACK.md) - Nuxt.js, Nuxt UI, Tailwind CSS v4
- [TypeScript Guide](./TYPESCRIPT_GUIDE.md) - TypeScript best practices
- [Proxy Architecture](./PROXY_ARCHITECTURE.md) - API proxy architecture
- [Auth Architecture](./AUTH_ARCHITECTURE.md) - Authentication architecture
- [Modules Architecture](./MODULES_ARCHITECTURE.md) - Module structure
- [Google OAuth Setup](./GOOGLE_OAUTH_SETUP.md) - Google OAuth 2.0 setup guide
- [Environment Setup](./ENVIRONMENT_SETUP.md) - Development environment setup
- [Development Guide](./DEVELOPMENT.md) - Development workflow

## Quick Start

Xem [README](../README.md) để biết cách setup và chạy dự án.
