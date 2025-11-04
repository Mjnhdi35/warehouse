# Proxy Architecture

## Tổng quan

Frontend sử dụng **server-side proxy** để ẩn backend URL hoàn toàn khỏi client, đảm bảo bảo mật và che giấu cấu trúc backend.

## Kiến trúc

```
Client Browser
    ↓
Frontend (Nuxt.js) - Port 3000
    ↓
Server Proxy (/api/*)
    ↓
Backend API (NestJS) - Port 3001 (Ẩn hoàn toàn)
```

## Proxy Route

### Route Pattern

```
/api/* → Proxy handler → Backend API
```

- **Client URL**: `/api/auth/login`
- **Proxy URL**: `http://localhost:3001/api/auth/login` (server-side only)
- **Client không biết**: Backend URL được ẩn hoàn toàn

### Implementation

Proxy được implement trong `apps/web/server/api/[...].ts`:

```typescript
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.apiBaseUrl; // Server-side only

  // Build target URL
  const url = buildProxyUrl(apiBaseUrl, path, query);

  // Forward request to backend
  const response = await $fetch(url, {
    method,
    headers: forwardHeaders,
    body,
    redirect: 'manual', // Manual redirect handling for OAuth
  });

  return response;
});
```

## OAuth Flow với Proxy

### Google OAuth Flow

1. **User click "Login with Google"**
   - Frontend redirect: `/api/auth/google` (proxy route)

2. **Proxy forward request**
   - Proxy gọi: `http://localhost:3001/api/auth/google` (backend)

3. **Backend Passport redirect**
   - Backend redirect: `https://accounts.google.com/oauth/...`
   - Proxy forward redirect header: `Location: https://accounts.google.com/...`

4. **Browser redirect**
   - Browser tự động redirect đến Google OAuth

5. **Google callback**
   - Google redirect về: `http://localhost:3001/api/auth/google/callback` (backend)
   - Backend xử lý, **set cookie trực tiếp** (không lộ token trong URL)
   - Backend redirect về frontend: `http://localhost:3000/auth/google-callback?success=true`

6. **Frontend callback**
   - Frontend kiểm tra cookie (đã được set từ backend)
   - **Token không lộ trong URL** - bảo mật hơn

### Redirect Handling

Proxy sử dụng `redirect: 'manual'` để handle redirects đúng cách:

```typescript
const response = await $fetch(url, {
  redirect: 'manual', // Don't follow redirects automatically
  onResponse({ response: res }) {
    // Forward redirect headers to browser
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (location) {
        setResponseStatus(event, res.status);
        setHeader(event, 'Location', location);
      }
    }
  },
});
```

## Security Benefits

### 1. Backend URL Ẩn

- ✅ Client không biết backend URL
- ✅ Backend không bị expose trong browser DevTools
- ✅ Khó khăn hơn cho attackers để tấn công trực tiếp backend

### 2. CORS Protection

- ✅ Backend không cần expose CORS headers
- ✅ Tất cả requests đi qua same-origin (frontend domain)
- ✅ Giảm nguy cơ CORS attacks

### 3. Request Filtering

- ✅ Proxy có thể filter/modify requests
- ✅ Add security headers
- ✅ Rate limiting
- ✅ Request validation

### 4. Token Security (OAuth)

- ✅ Token được set trong **cookie** (httpOnly) - không lộ trong URL
- ✅ Token không xuất hiện trong browser history
- ✅ Token không bị log trong server logs (URL)
- ✅ XSS protection với `httpOnly` cookie

## Configuration

### Environment Variables

**Frontend `.env`**:

```env
# Backend API URL (server-side only, không lộ ra client)
API_BASE_URL=http://localhost:3001/api
```

**Backend `.env`**:

```env
# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:3000
```

### Runtime Config

**Frontend `nuxt.config.ts`**:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    apiBaseUrl: process.env.API_BASE_URL!, // Server-side only
  },
});
```

## API Client

### useApi Composable

Client sử dụng `useApi` composable để gọi API qua proxy:

```typescript
import { useApi } from '~/composables/useApi';

// API call qua proxy
const response = await useApi<{ accessToken: string }>('/auth/login', {
  method: 'POST',
  body: { email, password },
});
```

### Proxy URL Building

Proxy tự động build URL:

```typescript
// Input: /api/auth/login
// Output: http://localhost:3001/api/auth/login
```

## Error Handling

### Proxy Errors

Proxy handle errors và forward appropriate status codes:

```typescript
try {
  const response = await $fetch(url, options);
  return response;
} catch (err) {
  // Handle redirect errors (for OAuth)
  if (error.response?.status >= 300 && error.response.status < 400) {
    // Forward redirect to browser
    return;
  }

  // Handle other errors
  return handleProxyError(event, err);
}
```

## Best Practices

### ✅ DO

1. **Luôn dùng proxy** cho tất cả API calls
2. **Không expose backend URL** trong client code
3. **Handle redirects đúng cách** cho OAuth flows
4. **Forward headers** cần thiết (cookies, authorization)

### ❌ DON'T

1. **Không hardcode backend URL** trong client code
2. **Không expose backend URL** trong environment variables public
3. **Không bypass proxy** bằng cách gọi trực tiếp backend

## Troubleshooting

### Proxy không hoạt động

1. Kiểm tra `API_BASE_URL` trong `.env`
2. Kiểm tra backend đang chạy
3. Kiểm tra network connectivity

### OAuth redirect không hoạt động

1. Kiểm tra `redirect: 'manual'` trong proxy
2. Kiểm tra redirect header forwarding
3. Kiểm tra `FRONTEND_URL` trong backend `.env`

### CORS errors

- ✅ Không nên có CORS errors vì tất cả requests đi qua proxy (same-origin)
- Nếu có, kiểm tra backend CORS configuration

## Tài liệu liên quan

- [Frontend Tech Stack](./FRONTEND_TECH_STACK.md) - Nuxt.js, Nuxt UI, Tailwind CSS
- [API README](../apps/api/README.md) - Backend API documentation
- [Auth Architecture](./AUTH_ARCHITECTURE.md) - Authentication flow
