# Hướng dẫn thiết lập Google OAuth 2.0

Hướng dẫn này sẽ giúp bạn thiết lập Google OAuth 2.0 credentials để sử dụng với Google Authentication strategy.

## Bước 1: Tạo Project trong Google Cloud Console

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Đăng nhập bằng Google account của bạn
3. Click vào dropdown project ở top bar (nếu đã có project, có thể tạo mới hoặc chọn existing)
4. Click **"New Project"** (nếu tạo mới)
   - Nhập tên project (ví dụ: "Warehouse App")
   - Click **"Create"**

## Bước 2: Bật Google+ API

1. Trong Google Cloud Console, vào **"APIs & Services"** → **"Library"**
2. Tìm kiếm **"Google+ API"** hoặc **"Google Identity"**
3. Click vào **"Google+ API"** hoặc **"Identity Toolkit API"**
4. Click **"Enable"** để bật API

## Bước 3: Tạo OAuth 2.0 Credentials

1. Vào **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Nếu chưa có OAuth consent screen, bạn sẽ được yêu cầu cấu hình:
   - **User Type**: Chọn **"External"** (cho development) hoặc **"Internal"** (cho G Suite)
   - Click **"Create"**
   - Điền thông tin:
     - **App name**: Tên ứng dụng (ví dụ: "Warehouse")
     - **User support email**: Email của bạn
     - **Developer contact information**: Email của bạn
   - Click **"Save and Continue"**
   - **Scopes**: Click **"Save and Continue"** (có thể bỏ qua)
   - **Test users**: Thêm email của bạn để test (nếu chọn External)
   - Click **"Save and Continue"** → **"Back to Dashboard"**

4. Tạo OAuth Client ID:
   - **Application type**: Chọn **"Web application"**
   - **Name**: Nhập tên (ví dụ: "Warehouse Web Client")
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3001
     http://localhost:3000
     ```
     (Thêm các domain khác nếu cần)
   - **Authorized redirect URIs**:
     ```
     http://localhost:3001/api/auth/google/callback
     ```
     (Thêm domain production khi deploy)
   - Click **"Create"**
   - **Lưu lại Client ID và Client Secret** (sẽ hiển thị trong popup)

## Bước 4: Cấu hình Environment Variables

Thêm các biến môi trường vào file `.env` của API:

```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```

**Lưu ý**:

- Thay `your-client-id-here` và `your-client-secret-here` bằng giá trị thực tế từ Google Cloud Console
- Đảm bảo `GOOGLE_CALLBACK_URL` khớp với **Authorized redirect URIs** đã cấu hình

## Bước 5: Test Google OAuth

1. Khởi động API server:

   ```bash
   cd apps/api
   yarn dev
   ```

2. Truy cập URL để bắt đầu OAuth flow:

   ```
   http://localhost:3001/api/auth/google
   ```

3. Bạn sẽ được chuyển hướng đến Google login page
4. Sau khi đăng nhập, Google sẽ redirect về callback URL
5. API sẽ tạo user mới (nếu chưa có) và trả về access token

## Troubleshooting

### Lỗi: "redirect_uri_mismatch"

- Đảm bảo `GOOGLE_CALLBACK_URL` khớp chính xác với **Authorized redirect URIs** trong Google Cloud Console
- Kiểm tra protocol (http/https), domain, port, và path

### Lỗi: "invalid_client"

- Kiểm tra `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` đã đúng chưa
- Đảm bảo không có khoảng trắng thừa

### Lỗi: "access_denied"

- Đảm bảo OAuth consent screen đã được cấu hình đúng
- Nếu chọn **External**, thêm email của bạn vào **Test users**

### Lỗi: "This app isn't verified"

- Đây là warning khi sử dụng External app type
- Trong development, bạn có thể bỏ qua bằng cách click **"Advanced"** → **"Go to [App Name] (unsafe)"**
- Để publish app, cần verify app với Google (process phức tạp hơn)

## Production Setup

Khi deploy lên production:

1. Thêm production domain vào **Authorized JavaScript origins**:

   ```
   https://yourdomain.com
   ```

2. Thêm production callback URL vào **Authorized redirect URIs**:

   ```
   https://yourdomain.com/api/auth/google/callback
   ```

3. Cập nhật environment variables trên production server:

   ```env
   GOOGLE_CLIENT_ID=your-production-client-id
   GOOGLE_CLIENT_SECRET=your-production-client-secret
   GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
   ```

4. Nếu cần, tạo OAuth client ID riêng cho production (recommended)

## Security Best Practices

1. **Không commit credentials vào Git**: Luôn sử dụng `.env` file và thêm vào `.gitignore`
2. **Sử dụng environment variables**: Không hardcode credentials trong code
3. **Rotate secrets định kỳ**: Đổi Client Secret định kỳ để tăng bảo mật
4. **Giới hạn redirect URIs**: Chỉ thêm các domain thực sự cần thiết
5. **Review OAuth consent screen**: Đảm bảo thông tin app chính xác

## Tài liệu tham khảo

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Passport Google OAuth Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
