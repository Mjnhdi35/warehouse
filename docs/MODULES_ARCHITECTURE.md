# Modules Architecture

Tài liệu này mô tả kiến trúc và best practices cho các modules trong Warehouse API.

## Tổng quan

Warehouse API được tổ chức theo **NestJS Module Pattern** với các nguyên tắc:

- ✅ **Separation of Concerns**: Mỗi module có trách nhiệm rõ ràng
- ✅ **Dependency Injection**: Sử dụng IoC container của NestJS
- ✅ **Single Responsibility**: Mỗi class/service chỉ làm một việc
- ✅ **DRY (Don't Repeat Yourself)**: Tránh duplicate code
- ✅ **Interface-based Design**: Sử dụng interfaces cho loose coupling

## Module Structure

### 1. Auth Module

**Trách nhiệm**: Authentication & Authorization

#### Cấu trúc

```
auth/
├── auth.controller.ts      # HTTP endpoints
├── auth.facade.ts          # Orchestration layer
├── auth.service.ts         # Business logic layer
├── auth.module.ts          # Module definition
├── tokens.service.ts       # Token management
├── dtos/                   # Data Transfer Objects
│   ├── login.dto.ts
│   ├── refresh-token.dto.ts
│   └── reset-password.dto.ts
├── guards/                 # Authentication guards
│   └── jwt-auth.guard.ts
├── strategies/             # Passport strategies
│   ├── jwt.strategy.ts
│   └── google.strategy.ts
├── interfaces/             # Contracts
│   ├── password-hasher.interface.ts
│   └── token-store.interface.ts
└── refresh-token.store.ts  # Redis token store
```

#### Layers

1. **Controller Layer** (`auth.controller.ts`)
   - Handle HTTP requests/responses
   - Validate input với DTOs
   - Inject `AuthFacade` only

2. **Facade Layer** (`auth.facade.ts`)
   - Orchestrate multiple services
   - Combine business logic + token generation
   - Inject: `AuthService`, `UsersService`, `TokensService`

3. **Service Layer** (`auth.service.ts`)
   - Pure business logic
   - User validation, password reset
   - Inject: `UsersService`, `PasswordHasher` (interface), `RedisService`

#### Dependencies

```typescript
AuthController
  ↓ injects
AuthFacade
  ↓ injects              ↓ injects          ↓ injects
AuthService         UsersService      TokensService
  ↓ injects              ↓ injects
PasswordHasher      UserRepository
RedisService
```

#### Endpoints

- `POST /api/auth/register` - Đăng ký user mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại (protected)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/reset-password/request` - Yêu cầu reset password
- `POST /api/auth/reset-password` - Reset password với token

### 2. Users Module

**Trách nhiệm**: User Management (CRUD operations)

#### Cấu trúc

```
users/
├── users.controller.ts    # HTTP endpoints
├── users.service.ts       # Business logic
├── users.module.ts        # Module definition
├── entities/              # Database entities
│   └── user.entity.ts
└── dtos/                  # Data Transfer Objects
    └── user.dto.ts
```

#### Layers

1. **Controller Layer** (`users.controller.ts`)
   - Handle HTTP requests/responses
   - CRUD operations
   - Inject `UsersService` directly (simple module)

2. **Service Layer** (`users.service.ts`)
   - Database operations
   - Business logic (validation, duplicate check)
   - Inject: `UserRepository` (TypeORM), `PasswordHasher` (interface)

#### Dependencies

```typescript
UsersController
  ↓ injects
UsersService
  ↓ injects              ↓ injects
UserRepository      PasswordHasher
```

#### Endpoints

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Dependency Injection Best Practices

### ✅ DO

1. **Use Interface-based Injection**

   ```typescript
   // ✅ Good - Use interface
   @Inject(PASSWORD_HASHER)
   private readonly passwordHasher: PasswordHasher
   ```

2. **Declare All Providers in Module**

   ```typescript
   @Module({
     providers: [AuthService, AuthFacade, ...],
   })
   ```

3. **Export Services That Other Modules Need**

   ```typescript
   @Module({
     exports: [UsersService, TypeOrmModule],
   })
   ```

4. **Use Facade Pattern for Complex Orchestration**
   ```typescript
   // ✅ Good - Facade orchestrates multiple services
   async login(body: LoginDto) {
     const user = await this.authService.validateUser(...);
     return this.tokensService.issueFor(user);
   }
   ```

### ❌ DON'T

1. **Don't Inject Concrete Classes Directly**

   ```typescript
   // ❌ Bad - Tight coupling
   private readonly bcryptService: BcryptService

   // ✅ Good - Use interface
   @Inject(PASSWORD_HASHER)
   private readonly passwordHasher: PasswordHasher
   ```

2. **Don't Mix Business Logic and Orchestration**

   ```typescript
   // ❌ Bad - Business logic in Facade
   async login(body: LoginDto) {
     const user = await this.usersService.findOneByEmail(...);
     const match = await this.passwordHasher.compare(...);
     // Business logic should be in Service
   }
   ```

3. **Don't Create Circular Dependencies**
   ```typescript
   // ❌ Bad - Circular dependency
   // AuthService injects AuthFacade
   // AuthFacade injects AuthService
   ```

## Password Hashing Strategy

### Consistent Interface Usage

**Tất cả modules sử dụng `PasswordHasher` interface** thay vì inject `BcryptService` trực tiếp:

```typescript
// ✅ AuthModule provides implementation
@Module({
  providers: [
    { provide: PASSWORD_HASHER, useClass: BcryptService },
  ],
})

// ✅ UsersService uses interface
@Inject(PASSWORD_HASHER)
private readonly passwordHasher: PasswordHasher

// ✅ AuthService uses interface
@Inject(PASSWORD_HASHER)
private readonly passwordHasher: PasswordHasher
```

**Lợi ích**:

- ✅ Loose coupling: Có thể thay đổi implementation (bcrypt → argon2)
- ✅ Testability: Dễ mock trong tests
- ✅ Consistency: Tất cả modules dùng cùng interface

## Module Communication

### Import/Export Pattern

```typescript
// UsersModule - Export services
@Module({
  exports: [UsersService, TypeOrmModule],
})

// AuthModule - Import UsersModule
@Module({
  imports: [UsersModule],  // Can now use UsersService
})
```

**Rules**:

- Module muốn sử dụng service của module khác → `imports`
- Module muốn expose service cho module khác → `exports`
- Không export → Service chỉ dùng trong module đó

## Error Handling

### Standard Exceptions

```typescript
// NotFoundException - Resource not found
throw new NotFoundException('User not found');

// ConflictException - Duplicate/Conflict
throw new ConflictException('Email already exists');

// UnauthorizedException - Authentication failed
throw new UnauthorizedException('Invalid credentials');

// BadRequestException - Invalid input
throw new BadRequestException('Invalid email format');
```

## Validation

### DTO Validation

Sử dụng `class-validator` decorators:

```typescript
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

**Global ValidationPipe** trong `main.ts` tự động validate:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

## Testing Strategy

### Unit Tests

Test từng service/facade độc lập:

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: jest.Mocked<UsersService>;
  let mockPasswordHasher: jest.Mocked<PasswordHasher>;

  beforeEach(() => {
    // Mock dependencies
    service = new AuthService(mockUsersService, mockPasswordHasher, ...);
  });
});
```

### Integration Tests

Test toàn bộ flow qua controller:

```typescript
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });
});
```

## Common Patterns

### 1. Repository Pattern (TypeORM)

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}
}
```

### 2. Strategy Pattern (Passport)

```typescript
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  // Strategy implementation
}
```

### 3. Facade Pattern

```typescript
@Injectable()
export class AuthFacade {
  // Orchestrates AuthService + TokensService + UsersService
}
```

### 4. Factory Pattern (Module Configuration)

```typescript
JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.getOrThrow<string>('JWT_SECRET'),
  }),
});
```

## Module Checklist

Khi tạo module mới, đảm bảo:

- [ ] Module có `@Module()` decorator
- [ ] Controllers declared trong `controllers`
- [ ] Services declared trong `providers`
- [ ] Exports services cần thiết cho modules khác
- [ ] Imports modules/services dependencies
- [ ] Uses interfaces thay vì concrete classes
- [ ] DTOs có validation decorators
- [ ] Error handling với standard exceptions
- [ ] Services có unit tests
- [ ] Controllers có integration tests

## Tài liệu liên quan

- [Auth Architecture](./AUTH_ARCHITECTURE.md) - Chi tiết về Auth module
- [Backend Tech Stack](./BACKEND_TECH_STACK.md) - NestJS, TypeORM, Redis
- [API README](../apps/api/README.md) - API documentation
