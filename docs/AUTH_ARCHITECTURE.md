# Auth Module Architecture

## Kiến trúc với Dependency Injection (IoC)

Auth module được tổ chức theo **Facade Pattern** với **Dependency Injection** đúng cách trong NestJS.

## Cấu trúc

```
auth/
├── auth.service.ts      # Business Logic Layer
├── auth.facade.ts       # Orchestration Layer (Facade)
├── auth.controller.ts   # Presentation Layer
└── tokens.service.ts    # Token Management
```

## Dependency Injection Flow

### 1. Module Declaration (`auth.module.ts`)

```typescript
@Module({
  providers: [
    AuthService,      // Business logic
    AuthFacade,       // Orchestration (Facade)
    TokensService,    // Token management
    // ... other providers
  ],
  controllers: [AuthController],
})
```

**Tất cả providers được declare trong module** → NestJS IoC container sẽ tự động inject.

### 2. Service Layer (`auth.service.ts`)

**Trách nhiệm**: Pure business logic, không phụ thuộc vào orchestration

```typescript
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,        // Injected
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,  // Injected via token
    private readonly redisService: RedisService,        // Injected
  ) {}

  // Pure business logic methods
  async validateUser(email: string, password: string) { ... }
  async requestPasswordReset(email: string) { ... }
  async resetPassword(token: string, newPassword: string) { ... }
  async validateGoogleUser(googleUser: GoogleUser) { ... }
}
```

**Key points**:

- ✅ Chỉ chứa business logic
- ✅ Không biết về token generation
- ✅ Có thể test độc lập
- ✅ Có thể reuse ở nhiều nơi

### 3. Facade Layer (`auth.facade.ts`)

**Trách nhiệm**: Orchestrate nhiều services để tạo complete flows

```typescript
@Injectable()
export class AuthFacade {
  constructor(
    private readonly authService: AuthService,      // Injected
    private readonly usersService: UsersService,    // Injected
    private readonly tokensService: TokensService,  // Injected
  ) {}

  // Orchestration methods - combine multiple services
  async login(body: LoginDto) {
    const user = await this.authService.validateUser(...);  // Use AuthService
    return this.tokensService.issueFor(user);               // Use TokensService
  }

  async googleLogin(googleUser: GoogleUser) {
    const user = await this.authService.validateGoogleUser(...);  // Use AuthService
    return this.tokensService.issueFor(user);                     // Use TokensService
  }
}
```

**Key points**:

- ✅ Inject `AuthService` và các services khác
- ✅ Orchestrate flows (combine multiple services)
- ✅ Controller chỉ cần biết về Facade
- ✅ Facade không chứa business logic, chỉ orchestrate

### 4. Controller Layer (`auth.controller.ts`)

**Trách nhiệm**: Handle HTTP requests, chỉ inject Facade

```typescript
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authFacade: AuthFacade, // Only inject Facade
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authFacade.login(body); // Delegate to Facade
  }
}
```

**Key points**:

- ✅ Controller chỉ inject `AuthFacade`
- ✅ Controller không biết về `AuthService` hay `TokensService`
- ✅ Single responsibility: Handle HTTP layer only

## Dependency Graph

```
AuthController
    ↓ (injects)
AuthFacade
    ↓ (injects)           ↓ (injects)          ↓ (injects)
AuthService         UsersService        TokensService
    ↓ (injects)           ↓ (injects)
PasswordHasher      UserEntity (via TypeORM)
RedisService
```

## IoC Container Flow

1. **Module Load**: `AuthModule` được load
2. **Provider Registration**:
   - `AuthService` → registered
   - `AuthFacade` → registered
   - `TokensService` → registered
3. **Dependency Resolution**:
   - NestJS tạo instance `AuthService` trước
   - Inject dependencies vào `AuthService` (UsersService, PasswordHasher, RedisService)
   - Tạo instance `AuthFacade`
   - Inject `AuthService`, `UsersService`, `TokensService` vào `AuthFacade`
   - Tạo instance `AuthController`
   - Inject `AuthFacade` vào `AuthController`
4. **Singleton**: Mỗi provider chỉ được tạo 1 lần (singleton pattern)

## Lợi ích của Architecture này

### 1. **Separation of Concerns**

- **AuthService**: Business logic
- **AuthFacade**: Orchestration
- **AuthController**: HTTP handling

### 2. **Testability**

```typescript
// Test AuthService independently
describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: jest.Mocked<UsersService>;

  beforeEach(() => {
    mockUsersService = createMockUsersService();
    service = new AuthService(mockUsersService, ...);
  });
});

// Test AuthFacade independently
describe('AuthFacade', () => {
  let facade: AuthFacade;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    mockAuthService = createMockAuthService();
    facade = new AuthFacade(mockAuthService, ...);
  });
});
```

### 3. **Reusability**

- `AuthService.validateUser()` có thể được dùng ở nhiều nơi
- `AuthService.validateGoogleUser()` có thể được dùng ở nhiều nơi
- Không bị lock vào một flow cụ thể

### 4. **Maintainability**

- Thay đổi business logic → chỉ sửa `AuthService`
- Thay đổi flow → chỉ sửa `AuthFacade`
- Thay đổi API → chỉ sửa `AuthController`

### 5. **Dependency Injection Benefits**

- ✅ Loose coupling: Services không depend trực tiếp vào nhau
- ✅ Easy to mock: Có thể inject mock services cho testing
- ✅ Single responsibility: Mỗi class có một trách nhiệm rõ ràng
- ✅ Open/Closed principle: Dễ extend, khó modify

## Best Practices

### ✅ DO

1. **Service chỉ chứa business logic**

   ```typescript
   // ✅ Good
   async validateUser(email: string, password: string) {
     // Pure business logic
   }
   ```

2. **Facade orchestrate nhiều services**

   ```typescript
   // ✅ Good
   async login(body: LoginDto) {
     const user = await this.authService.validateUser(...);
     return this.tokensService.issueFor(user);
   }
   ```

3. **Controller chỉ inject Facade**
   ```typescript
   // ✅ Good
   constructor(private readonly authFacade: AuthFacade) {}
   ```

### ❌ DON'T

1. **Không mix business logic vào Facade**

   ```typescript
   // ❌ Bad
   async login(body: LoginDto) {
     const user = await this.usersService.findOneByEmail(...);
     const match = await this.passwordHasher.compare(...);
     // Business logic should be in AuthService
   }
   ```

2. **Controller không inject Service trực tiếp**

   ```typescript
   // ❌ Bad (unless there's a specific reason)
   constructor(
     private readonly authService: AuthService,
     private readonly tokensService: TokensService,
   ) {}
   ```

3. **Không tạo circular dependencies**
   ```typescript
   // ❌ Bad
   // AuthService inject AuthFacade
   // AuthFacade inject AuthService
   // → Circular dependency!
   ```

## Khi nào cần thêm Service mới?

- **Business logic mới** → Thêm vào `AuthService`
- **Flow mới cần orchestrate** → Thêm vào `AuthFacade`
- **API endpoint mới** → Thêm vào `AuthController`

## Kết luận

Architecture này tuân theo:

- ✅ **Dependency Injection** (IoC) pattern
- ✅ **Facade** pattern
- ✅ **Single Responsibility** principle
- ✅ **Separation of Concerns**

NestJS IoC container tự động quản lý lifecycle và dependencies của tất cả providers.
