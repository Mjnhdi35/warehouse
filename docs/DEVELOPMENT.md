# Development Guide

Hướng dẫn chi tiết cho việc phát triển dự án Warehouse.

## 📋 Mục lục

- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Git Workflow](#git-workflow)
- [Testing](#testing)
- [Debugging](#debugging)
- [Common Tasks](#common-tasks)
- [Best Practices](#best-practices)

## 🚀 Development Setup

### Prerequisites

1. **Node.js 22.16.0**

   ```bash
   # Sử dụng nvm để quản lý Node version
   nvm install 22.16.0
   nvm use 22.16.0
   ```

2. **Yarn 4.10.3**

   ```bash
   # Enable Corepack (tự động quản lý Yarn version)
   corepack enable
   ```

3. **PostgreSQL**
   - Install PostgreSQL 12+
   - Create database: `warehouse_db`

4. **Redis**
   - Install Redis 6+
   - Start Redis server

### Initial Setup

```bash
# 1. Clone repository
git clone https://github.com/Mjnhdi35/warehouse.git
cd warehouse

# 2. Enable Corepack
corepack enable

# 3. Install dependencies
yarn install

# 4. Setup environment variables
# Copy .env.example files and fill in values
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env với database và Redis credentials

# 5. Run database migrations
cd apps/api
yarn migration:run

# 6. Start development servers
# Terminal 1 - API
cd apps/api
yarn dev

# Terminal 2 - Web
cd apps/web
yarn dev
```

## 📝 Code Style

### TypeScript

- **Strict mode**: Enabled
- **No implicit any**: Enabled
- **Strict null checks**: Enabled

### Naming Conventions

- **Files**: kebab-case
  - `user-service.ts`
  - `auth-controller.ts`
  - `user.entity.ts`

- **Classes/Interfaces/Types**: PascalCase

  ```typescript
  class UserService {}
  interface AuthRequest {}
  type UserId = string;
  ```

- **Variables/Functions**: camelCase

  ```typescript
  const userId = '123';
  function getUserById(id: string) {}
  ```

- **Constants**: UPPER_SNAKE_CASE
  ```typescript
  const MAX_RETRY_COUNT = 3;
  const API_BASE_URL = 'https://api.example.com';
  ```

### Code Formatting

- **Prettier**: Auto-format on save
- **Line length**: 100 characters
- **Semicolons**: Yes
- **Quotes**: Single quotes for strings

### ESLint Rules

- **Backend**: NestJS ESLint config
- **Frontend**: Nuxt ESLint config

### Import Order

1. External packages
2. Internal modules
3. Relative imports
4. Types (with `type` keyword)

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/user.dto';

import type { User } from '../types/user.type';
```

## 🔀 Git Workflow

### Branch Strategy

- `main` - Production branch
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Hotfix branches

### Commit Messages

Format: `<type>(<scope>): <subject>`

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:

```
feat(auth): add refresh token endpoint
fix(users): fix user deletion bug
docs(api): update API documentation
style(web): format code with prettier
```

### Pull Request Process

1. Create feature branch from `develop`
2. Make changes and commit
3. Push to remote
4. Create Pull Request
5. Code review
6. Merge to `develop`
7. Deploy to staging
8. Merge to `main` after testing

## 🧪 Testing

### Backend Tests

```bash
# Run all tests
yarn test

# Watch mode
yarn test:watch

# Coverage
yarn test:cov

# E2E tests
yarn test:e2e

# Specific test file
yarn test users.service.spec.ts
```

### Writing Tests

#### Unit Tests

```typescript
describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = { email: 'test@example.com', password: 'password' };
    const result = await service.create(dto);

    expect(result).toBeDefined();
    expect(result.email).toBe(dto.email);
  });
});
```

#### E2E Tests

```typescript
describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer()).get('/api/users').expect(200);
  });
});
```

### Frontend Tests

Frontend testing setup (Vitest/Playwright) có thể được thêm sau.

## 🐛 Debugging

### Backend Debugging

#### VS Code Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug API",
      "runtimeExecutable": "yarn",
      "runtimeArgs": ["dev"],
      "cwd": "${workspaceFolder}/apps/api",
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

#### Debug Mode

```bash
cd apps/api
yarn start:debug
```

### Frontend Debugging

- Use Vue DevTools browser extension
- Use browser DevTools
- Console logging
- Network tab cho API calls

### Database Debugging

```bash
# Connect to PostgreSQL
psql -U postgres -d warehouse_db

# Check migrations
SELECT * FROM migrations;

# Check tables
\dt

# Query data
SELECT * FROM users;
```

### Redis Debugging

```bash
# Connect to Redis CLI
redis-cli

# Check keys
KEYS *

# Get value
GET refresh_token:user_id
```

## ✅ Common Tasks

### Adding a New Feature

1. **Create feature branch**

   ```bash
   git checkout -b feature/new-feature
   ```

2. **Backend: Create module**

   ```bash
   cd apps/api
   nest g module modules/new-feature
   nest g controller modules/new-feature
   nest g service modules/new-feature
   ```

3. **Create entity**

   ```typescript
   // src/modules/new-feature/entities/new-feature.entity.ts
   @Entity('new_feature')
   export class NewFeatureEntity extends BaseEntity {
     // ...
   }
   ```

4. **Create DTOs**

   ```typescript
   // src/modules/new-feature/dtos/create-new-feature.dto.ts
   export class CreateNewFeatureDto {
     // ...
   }
   ```

5. **Create migration**

   ```bash
   yarn migration:generate -n CreateNewFeature
   ```

6. **Write tests**

   ```typescript
   // src/modules/new-feature/new-feature.service.spec.ts
   ```

7. **Frontend: Create pages/components**

   ```bash
   # Create page
   touch app/pages/new-feature/index.vue

   # Create component
   touch app/components/NewFeatureCard.vue
   ```

8. **Test locally**

   ```bash
   # Backend
   yarn test
   yarn dev

   # Frontend
   yarn dev
   ```

9. **Commit and push**
   ```bash
   git add .
   git commit -m "feat(new-feature): add new feature"
   git push origin feature/new-feature
   ```

### Database Migration

```bash
# 1. Make entity changes
# Edit entity file

# 2. Generate migration
yarn migration:generate -n MigrationName

# 3. Review migration file
# Check generated SQL

# 4. Run migration
yarn migration:run

# 5. If needed, revert
yarn migration:revert
```

### Adding New Dependencies

```bash
# Add to specific workspace
yarn workspace @warehouse/api add package-name
yarn workspace @warehouse/web add package-name

# Add dev dependency
yarn workspace @warehouse/api add -D package-name

# Add to root
yarn add -W package-name
```

### Updating Dependencies

```bash
# Update all dependencies
yarn upgrade-interactive

# Update specific package
yarn workspace @warehouse/api upgrade package-name
```

## 💡 Best Practices

### Backend

1. **Services**: Business logic trong services, không trong controllers
2. **DTOs**: Luôn sử dụng DTOs cho validation
3. **Error Handling**: Sử dụng NestJS exceptions
4. **Database**: Sử dụng transactions cho complex operations
5. **Security**: Hash passwords, validate input, sanitize data
6. **Logging**: Log important events và errors
7. **Testing**: Write tests cho business logic

### Frontend

1. **Components**: Reusable và composable
2. **State**: Use composables cho state management
3. **API Calls**: Centralize API logic trong composables
4. **Error Handling**: Handle errors gracefully
5. **Loading States**: Show loading indicators
6. **Validation**: Validate forms client-side
7. **Accessibility**: Use semantic HTML

### General

1. **Code Review**: Review code trước khi merge
2. **Documentation**: Update docs khi thêm features
3. **Performance**: Optimize queries và renders
4. **Security**: Follow security best practices
5. **Testing**: Maintain test coverage
6. **Refactoring**: Refactor code thường xuyên

## 📚 Resources

- [NestJS Best Practices](https://docs.nestjs.com/recipes/prisma)
- [Vue.js Style Guide](https://vuejs.org/style-guide/)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [Git Best Practices](https://www.atlassian.com/git/tutorials/comparing-workflows)
