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
