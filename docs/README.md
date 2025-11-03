## Phát triển local: API với Docker Compose

### 1) Khởi động hạ tầng (Postgres + Redis)

Chạy từ thư mục gốc repo:

```bash
docker compose -f apps/api/docker-compose.yml up -d
```

Kiểm tra nhanh:

- Postgres mở cổng host `5432`
- Redis mở cổng host `6379`

### 2) Cấu hình DB_URL cho API

Nếu chạy API trên máy local (không trong container):

```env
DB_URL=postgres://postgres:postgres@localhost:5432/warehouse_dev
NODE_ENV=development
```

Nếu chạy API bên trong container (cùng network với compose):

```env
DB_URL=postgres://postgres:postgres@postgres:5432/warehouse_dev
NODE_ENV=development
```

Lưu ý:

- Dùng scheme `postgres` (không phải `localhost://...`).
- Hostname `postgres` chỉ resolve được trong Docker network; trên host dùng `localhost`.

Đặt file env tại `apps/api/.env` hoặc export biến môi trường trước khi chạy app.

### 3) Chạy API bằng Yarn Workspaces

```bash
yarn workspace @warehouse/api dev
```

### 4) (Tuỳ chọn) Chạy TypeORM migrations

Đảm bảo `DB_URL` đã được đặt trong môi trường, sau đó:

```bash
yarn workspace @warehouse/api migration:run
```

### 5) Gỡ lỗi nhanh

- Không resolve được host `postgres` từ máy host → dùng `localhost` trong `DB_URL`.
- Connection refused → kiểm tra compose đã chạy: `docker ps` và xem logs của Postgres.
- Biến môi trường không nạp → kiểm tra `apps/api/.env` tồn tại và đúng môi trường.

## Kiểm thử (Testing)

### Chạy từ thư mục gốc (khuyến nghị)

```bash
# E2E cho API (@warehouse/api)
yarn api:test:e2e
```

### Chạy trực tiếp trong `apps/api`

```bash
cd apps/api

# Unit tests
yarn test

# E2E tests
yarn test:e2e
```

Ghi chú:

- Khi chạy test, `NODE_ENV=test` sẽ được đặt tự động bởi Jest.
- Guard JWT được nới lỏng trong môi trường test: các request được cho phép để E2E tập trung vào hành vi API, không chặn bởi xác thực.

## Tính năng hiện có

### API (@warehouse/api - NestJS)

- **Health**: `GET /api/health` (trạng thái app, DB, Redis), `GET /api/health/info` (thông tin runtime), `GET /api/health/files?path=.` (duyệt file an toàn trong workspace).
- **Auth**:
  - `POST /api/auth/login` – trả về `accessToken` và set header `Authorization`.
  - `POST /api/auth/register` – đăng ký + phát hành token.
  - `POST /api/auth/refresh` – làm mới access token từ refresh token (qua header `Authorization` hoặc body `refreshToken`).
  - `POST /api/auth/logout` – thu hồi refresh token.
  - `GET /api/auth/me` – lấy thông tin người dùng từ JWT (yêu cầu xác thực, trừ môi trường test).
- **Users**: CRUD cơ bản (`/api/users`, `/api/users/:id`).
- **Roles/Permissions**: Module khởi tạo sẵn (entities, services, controllers) để mở rộng phân quyền.
- **CSDL & Cache**: TypeORM (Postgres) và Redis (Upstash/redis client) đã tích hợp.
- **Bảo mật**: JWT strategy, `JwtAuthGuard` áp dụng toàn cục, hỗ trợ decorator `@Public()` để mở endpoint.

### Web (Nuxt)

- Cấu trúc dự án Nuxt đã sẵn sàng trong `apps/web` (pages, layouts, server routes cơ bản). Chưa có test tự động.

## Lệnh hữu ích

Từ thư mục gốc:

```bash
# Format, typecheck, lint, build tất cả workspace
yarn valid

# Build tất cả packages/apps qua Nx
yarn build
```
