# Environment Setup Guide

Hướng dẫn chi tiết setup môi trường development cho dự án Warehouse.

## 📋 Mục lục

- [System Requirements](#system-requirements)
- [Node.js Setup](#nodejs-setup)
- [Database Setup](#database-setup)
- [Redis Setup](#redis-setup)
- [Environment Variables](#environment-variables)
- [Verification](#verification)

## 💻 System Requirements

### Operating System

- **Windows**: Windows 10/11
- **macOS**: macOS 10.15+
- **Linux**: Ubuntu 20.04+ / Debian 11+

### Required Software

- Node.js 22.16.0
- PostgreSQL 12+
- Redis 6+
- Git
- Yarn 4.10.3 (via Corepack)

## 📦 Node.js Setup

### Option 1: Using NVM (Recommended)

#### Windows

1. Download NVM for Windows: https://github.com/coreybutler/nvm-windows/releases
2. Install nvm-setup.exe
3. Open new terminal:
   ```bash
   nvm install 22.16.0
   nvm use 22.16.0
   ```

#### macOS/Linux

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc  # or ~/.zshrc

# Install Node.js
nvm install 22.16.0
nvm use 22.16.0
nvm alias default 22.16.0
```

### Option 2: Direct Installation

1. Download từ https://nodejs.org/
2. Install Node.js 22.16.0
3. Verify:
   ```bash
   node --version  # Should be v22.16.0
   npm --version
   ```

### Enable Corepack

```bash
corepack enable
```

Verify Yarn version:

```bash
yarn --version  # Should be 4.10.3
```

## 🗄️ Database Setup

### PostgreSQL Installation

#### Windows

1. Download PostgreSQL: https://www.postgresql.org/download/windows/
2. Run installer
3. Set password cho postgres user
4. Complete installation

#### macOS

```bash
# Using Homebrew
brew install postgresql@14
brew services start postgresql@14
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE warehouse_db;

# Create user (optional)
CREATE USER warehouse_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE warehouse_db TO warehouse_user;

# Exit
\q
```

### Verify Database

```bash
# Connect to database
psql -U postgres -d warehouse_db

# Check connection
SELECT version();

# Exit
\q
```

## 🔴 Redis Setup

### Redis Installation

#### Windows

1. Download: https://github.com/microsoftarchive/redis/releases
2. Extract và run `redis-server.exe`
3. Hoặc sử dụng WSL2 với Redis

#### macOS

```bash
# Using Homebrew
brew install redis
brew services start redis
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### Verify Redis

```bash
# Connect to Redis CLI
redis-cli

# Test connection
PING  # Should return PONG

# Check info
INFO server

# Exit
exit
```

## 🔐 Environment Variables

### Backend API

Tạo file `apps/api/.env`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/warehouse_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```

**Lưu ý quan trọng:**

- Thay `password` bằng PostgreSQL password của bạn
- Thay `your-super-secret-jwt-key...` bằng random secure strings
- Generate secure secrets:

  ```bash
  # Linux/macOS
  openssl rand -base64 32

  # Or use online generator
  ```

### Frontend Web

Tạo file `apps/web/.env` (nếu cần):

```env
# API Configuration
API_URL=http://localhost:3001/api

# Public runtime config (accessible in browser)
NUXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Environment File Template

Tạo `.env.example` files để document required variables:

**apps/api/.env.example:**

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/warehouse_db
JWT_SECRET=change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=change-this-in-production
JWT_REFRESH_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
```

## ✅ Verification

### 1. Verify Node.js

```bash
node --version  # Should be v22.16.0
npm --version
yarn --version  # Should be 4.10.3
```

### 2. Verify PostgreSQL

```bash
psql --version
psql -U postgres -c "SELECT version();"
```

### 3. Verify Redis

```bash
redis-cli --version
redis-cli ping  # Should return PONG
```

### 4. Verify Project Setup

```bash
# Clone và install
git clone https://github.com/Mjnhdi35/warehouse.git
cd warehouse
yarn install

# Check installations
yarn workspace @warehouse/api tsc --version
yarn workspace @warehouse/web tsc --version
```

### 5. Test Database Connection

```bash
cd apps/api

# Update .env với database credentials
# Then test connection
yarn migration:run
```

### 6. Test Redis Connection

```bash
# Start API server
yarn dev

# In another terminal, test Redis
redis-cli
> KEYS *
> exit
```

### 7. Start Development Servers

```bash
# Terminal 1 - API
cd apps/api
yarn dev
# Should start on http://localhost:3001

# Terminal 2 - Web
cd apps/web
yarn dev
# Should start on http://localhost:3000
```

## 🐛 Troubleshooting

### Node.js Issues

**Problem**: Wrong Node.js version

```bash
# Solution: Use nvm
nvm use 22.16.0
```

**Problem**: Yarn version mismatch

```bash
# Solution: Enable Corepack
corepack enable
```

### PostgreSQL Issues

**Problem**: Cannot connect to database

```bash
# Check if PostgreSQL is running
# Windows
Get-Service postgresql*

# Linux/macOS
sudo systemctl status postgresql
# or
brew services list
```

**Problem**: Authentication failed

- Check password trong `.env`
- Verify user permissions
- Check `pg_hba.conf` configuration

### Redis Issues

**Problem**: Redis not running

```bash
# Start Redis
# Windows: Run redis-server.exe
# Linux
sudo systemctl start redis-server

# macOS
brew services start redis
```

**Problem**: Connection refused

- Check Redis is listening on port 6379
- Check firewall settings
- Verify REDIS_URL trong `.env`

### Port Conflicts

**Problem**: Port 3001 or 3000 already in use

**Windows:**

```powershell
# Find process
netstat -ano | findstr :3001

# Kill process
taskkill /PID <PID> /F
```

**Linux/macOS:**

```bash
# Find process
lsof -i :3001

# Kill process
kill -9 <PID>
```

## 📚 Additional Resources

- [Node.js Installation Guide](https://nodejs.org/en/download/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/docs/)
- [Yarn Documentation](https://yarnpkg.com/getting-started)

## 🔄 Next Steps

Sau khi setup xong môi trường:

1. ✅ Verify all installations
2. ✅ Setup environment variables
3. ✅ Run database migrations
4. ✅ Start development servers
5. ✅ Read [Development Guide](./DEVELOPMENT.md)
6. ✅ Read [API Documentation](../apps/api/README.md)
7. ✅ Read [Web Documentation](../apps/web/README.md)
