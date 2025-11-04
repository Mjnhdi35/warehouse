# Backend Tech Stack: NestJS, TypeORM, Redis

Tài liệu về các công nghệ backend được sử dụng trong dự án Warehouse.

## 📋 Mục lục

- [NestJS](#nestjs)
- [TypeORM](#typeorm)
- [Redis](#redis)
- [Best Practices](#best-practices)
- [Resources](#resources)

---

## 🚀 NestJS

### Giới thiệu

NestJS là một framework Node.js tiến bộ để xây dựng các ứng dụng server-side hiệu quả và có thể mở rộng. Nó sử dụng TypeScript và được xây dựng dựa trên Express.js, hỗ trợ Dependency Injection và kiến trúc modular.

### Cấu trúc dự án

```
apps/api/src/
├── modules/           # Feature modules
│   ├── auth/
│   ├── users/
│   └── ...
├── common/            # Shared utilities
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/           # Configuration
└── main.ts           # Application entry point
```

### Module Pattern

```typescript
// Module definition
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

### Controller

```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

### Service

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }
}
```

### Dependency Injection

```typescript
// Constructor injection
constructor(
  private readonly usersService: UsersService,
  private readonly configService: ConfigService,
) {}
```

### Guards

```typescript
// JWT Auth Guard
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```

### Interceptors

```typescript
// Response transformation
@UseInterceptors(ClassSerializerInterceptor)
@Get()
findAll() {
  return this.usersService.findAll();
}
```

### Pipes

```typescript
// Validation pipe
@Post()
create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

### Error Handling

```typescript
// Custom exception
throw new NotFoundException('User not found');
throw new BadRequestException('Invalid input');
throw new UnauthorizedException('Unauthorized');
```

### Configuration

```typescript
// app.module.ts
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
}),

// Usage
constructor(private configService: ConfigService) {
  const dbUrl = this.configService.get<string>('DB_URL');
}
```

---

## 🗄️ TypeORM

### Giới thiệu

TypeORM là một ORM (Object-Relational Mapping) cho TypeScript và JavaScript, hỗ trợ nhiều database như PostgreSQL, MySQL, SQLite, v.v.

### Entity Definition

```typescript
@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  displayName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
```

### Relationships

```typescript
// One-to-Many
@OneToMany(() => OrderEntity, order => order.user)
orders: OrderEntity[];

// Many-to-One
@ManyToOne(() => UserEntity, user => user.orders)
user: UserEntity;

// Many-to-Many
@ManyToMany(() => RoleEntity, role => role.users)
@JoinTable()
roles: RoleEntity[];
```

### Repository Pattern

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Find operations
  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Create
  async create(data: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  // Update
  async update(id: string, data: UpdateUserDto): Promise<UserEntity> {
    await this.userRepository.update(id, data);
    return this.findOne(id);
  }

  // Delete
  async remove(id: string): Promise<void> {
    await this.userRepository.remove(await this.findOne(id));
  }
}
```

### Query Builder

```typescript
// Complex queries
const users = await this.userRepository
  .createQueryBuilder('user')
  .where('user.email = :email', { email })
  .andWhere('user.isActive = :isActive', { isActive: true })
  .leftJoinAndSelect('user.orders', 'order')
  .orderBy('user.createdAt', 'DESC')
  .getMany();
```

### Transactions

```typescript
async createWithOrders(userData: CreateUserDto, orders: CreateOrderDto[]) {
  return await this.dataSource.transaction(async manager => {
    const user = manager.create(UserEntity, userData);
    await manager.save(user);

    const orderEntities = orders.map(order =>
      manager.create(OrderEntity, { ...order, userId: user.id })
    );
    await manager.save(orderEntities);

    return user;
  });
}
```

### Migrations

```bash
# Generate migration
yarn migration:generate -n CreateUserTable

# Run migrations
yarn migration:run

# Revert migration
yarn migration:revert
```

```typescript
// Migration file
export class CreateUserTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          // ...
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

### Data Source Configuration

```typescript
// app.module.ts
TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    url: configService.get<string>('DB_URL'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false, // Never true in production
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    migrationsRun: false,
  }),
}),
```

---

## 💾 Redis

### Giới thiệu

Redis là một in-memory data structure store, được sử dụng như database, cache, và message broker. Trong dự án này, Redis được sử dụng chủ yếu cho caching và session management.

### Setup Redis

```typescript
// app.module.ts
import { RedisModule } from '@nestjs-modules/ioredis';

RedisModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    config: {
      url: configService.get<string>('REDIS_URL'),
    },
  }),
}),
```

### Redis Service

```typescript
import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  // String operations
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.setex(key, ttl, value);
    } else {
      await this.redis.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  // Hash operations
  async hset(key: string, field: string, value: string): Promise<void> {
    await this.redis.hset(key, field, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    return this.redis.hget(key, field);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.redis.hgetall(key);
  }

  // List operations
  async lpush(key: string, ...values: string[]): Promise<number> {
    return this.redis.lpush(key, ...values);
  }

  async rpop(key: string): Promise<string | null> {
    return this.redis.rpop(key);
  }

  // Set operations
  async sadd(key: string, ...members: string[]): Promise<number> {
    return this.redis.sadd(key, ...members);
  }

  async smembers(key: string): Promise<string[]> {
    return this.redis.smembers(key);
  }

  // Expiration
  async expire(key: string, seconds: number): Promise<void> {
    await this.redis.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }
}
```

### Use Cases

#### 1. Caching

```typescript
@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: Repository<UserEntity>,
    private readonly redisService: RedisService,
  ) {}

  async findOne(id: string): Promise<UserEntity> {
    const cacheKey = `user:${id}`;

    // Check cache
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Fetch from database
    const user = await this.userRepository.findOne({ where: { id } });

    // Cache for 1 hour
    if (user) {
      await this.redisService.set(cacheKey, JSON.stringify(user), 3600);
    }

    return user;
  }
}
```

#### 2. Session Management

```typescript
// Store refresh token
async storeRefreshToken(userId: string, token: string): Promise<void> {
  const key = `refresh_token:${userId}`;
  await this.redisService.set(key, token, 7 * 24 * 60 * 60); // 7 days
}

// Verify refresh token
async verifyRefreshToken(userId: string, token: string): Promise<boolean> {
  const key = `refresh_token:${userId}`;
  const stored = await this.redisService.get(key);
  return stored === token;
}

// Revoke refresh token
async revokeRefreshToken(userId: string): Promise<void> {
  const key = `refresh_token:${userId}`;
  await this.redisService.del(key);
}
```

#### 3. Rate Limiting

```typescript
async checkRateLimit(key: string, limit: number, window: number): Promise<boolean> {
  const count = await this.redisService.incr(key);

  if (count === 1) {
    await this.redisService.expire(key, window);
  }

  return count <= limit;
}
```

---

## ✅ Best Practices

### NestJS

1. **Modular Architecture**: Tổ chức code theo modules
2. **Dependency Injection**: Sử dụng DI thay vì hard dependencies
3. **DTOs**: Luôn validate input với DTOs
4. **Guards**: Sử dụng guards cho authentication/authorization
5. **Interceptors**: Transform responses và handle errors
6. **Exception Filters**: Custom exception handling

### TypeORM

1. **Entities**: Sử dụng entities thay vì raw SQL
2. **Migrations**: Luôn dùng migrations, không dùng `synchronize: true` trong production
3. **Relations**: Sử dụng relations thay vì manual joins
4. **Transactions**: Dùng transactions cho complex operations
5. **Indexes**: Thêm indexes cho các columns thường query

### Redis

1. **Key Naming**: Sử dụng consistent naming convention (e.g., `user:${id}`)
2. **TTL**: Luôn set TTL cho cached data
3. **Connection Pooling**: Sử dụng connection pooling
4. **Error Handling**: Handle Redis connection errors gracefully
5. **Memory Management**: Monitor memory usage

---

## 📚 Resources

### NestJS

- [Official Documentation](https://docs.nestjs.com/)
- [NestJS GitHub](https://github.com/nestjs/nest)
- [NestJS Best Practices](https://github.com/nestjs/nest/tree/master/sample)

### TypeORM

- [Official Documentation](https://typeorm.io/)
- [TypeORM GitHub](https://github.com/typeorm/typeorm)
- [TypeORM Migrations Guide](https://typeorm.io/migrations)

### Redis

- [Redis Documentation](https://redis.io/docs/)
- [Redis Commands](https://redis.io/commands/)
- [ioredis (Node.js client)](https://github.com/redis/ioredis)

---

## 🔧 Common Commands

```bash
# NestJS CLI
nest g module modules/users
nest g controller modules/users
nest g service modules/users

# TypeORM Migrations
yarn migration:generate -n MigrationName
yarn migration:run
yarn migration:revert

# Redis CLI
redis-cli
> KEYS *
> GET user:123
> SET key value EX 3600
```

---

_Last updated: 2025_
