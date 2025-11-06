# Warehouse Web

Frontend application cho hệ thống Warehouse, được xây dựng với Nuxt.js 4.

## 📋 Tổng quan

Web application cung cấp:

- User interface cho warehouse management
- Authentication pages
- Admin dashboard
- Responsive design với Tailwind CSS

## 🚀 Quick Start

### Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

Application sẽ chạy tại `http://localhost:3000`

## 🏗️ Architecture

### Directory Structure

```
app/
├── app.vue                 # Root component
├── assets/
│   ├── css/
│   │   └── main.css       # Global styles
│   └── images/            # Images
├── layouts/
│   ├── default.vue        # Default layout
│   ├── admin.vue          # Admin layout
│   └── auth.vue           # Auth layout
└── pages/
    ├── index.vue          # Home page
    ├── admin/             # Admin pages
    └── auth/              # Auth pages

server/
├── api/                   # Server API routes
├── middleware/            # Server middleware
└── plugins/              # Server plugins

public/                    # Static files
```

### Nuxt.js Features

- **SSR**: Enabled for better SEO and performance
- **Client-side pages**: Auth pages use `ssr: false` (client-side only)
- **TypeScript**: Full TypeScript support
- **Auto-imports**: Components, composables tự động import
- **File-based routing**: Pages tự động từ `app/pages/`
- **Layouts**: Reusable layouts

## 🎨 UI Framework

### Nuxt UI

Application sử dụng Nuxt UI 4.x - một UI framework built on top of Tailwind CSS và Headless UI.

**Components available:**

- Button, Input, Card, Modal, etc.
- Form components
- Navigation components
- Data display components

### Tailwind CSS

Styling với Tailwind CSS 4.x:

- Utility-first CSS framework
- Responsive design
- Customizable theme
- Dark mode support (nếu cần)

### Icons

Nuxt Icon được sử dụng để hiển thị icons:

```vue
<Icon name="heroicons:user" />
```

## 🔧 Configuration

### Nuxt Config

File `nuxt.config.ts` chứa:

```typescript
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: false, // Client-side rendering
  typescript: {
    typeCheck: true,
  },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/icon', '@nuxt/fonts'],
});
```

### Environment Variables

Tạo file `.env` trong `apps/web/`:

```env
# Backend API URL (server-side only, không lộ ra client)
API_BASE_URL=http://localhost:3001/api
```

**Lưu ý**: Backend URL được ẩn hoàn toàn khỏi client. Tất cả API calls đều đi qua proxy `/api/*` để ẩn backend URL.

## 📦 Modules

### @nuxt/eslint

ESLint integration cho code quality:

```bash
yarn lint
```

### @nuxt/ui

UI component library.

### @nuxt/icon

Icon system với support cho nhiều icon libraries.

### @nuxt/fonts

Font optimization và loading.

### @nuxtjs/tailwindcss

Tailwind CSS integration.

## 🎯 Pages & Routes

### File-based Routing

Pages tự động được tạo routes từ `app/pages/`:

```
pages/
├── index.vue          → /
├── admin/
│   └── index.vue      → /admin
└── auth/
    ├── login.vue      → /auth/login
    └── register.vue   → /auth/register
```

### Layouts

Layouts được apply trong pages:

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});
</script>
```

Available layouts:

- `default` - Default layout
- `admin` - Admin dashboard layout
- `auth` - Authentication pages layout

## 🔌 API Integration

### API Proxy

Tất cả API calls đều đi qua server proxy để **ẩn backend URL** khỏi client:

- **Proxy Route**: `/api/*` → Server-side proxy
- **Backend URL**: Ẩn hoàn toàn, chỉ có server biết
- **Security**: Client không thể truy cập trực tiếp backend

### API Client

Sử dụng composable `useApi` để gọi API:

```typescript
import { useApi } from '~/composables/useApi';

// API call qua proxy
const response = await useApi<{ accessToken: string }>('/auth/login', {
  method: 'POST',
  body: { email, password },
});
```

Proxy tự động:

- Forward request đến backend
- Handle redirects (OAuth flows)
- Forward response headers
- Error handling

### Composables

#### useAuth

Composable để quản lý authentication state và token storage:

```typescript
import { useAuth } from '~/composables/useAuth';

const {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  isAuthenticated,
  handleAuthSuccess,
  handleAuthError,
  logout,
} = useAuth();
```

**Methods:**

- `getAccessToken()` - Lấy access token cookie
- `setAccessToken(token)` - Set access token cookie
- `removeAccessToken()` - Xóa access token cookie
- `isAuthenticated` - Computed property để check authentication state
- `handleAuthSuccess(token, message?, redirectPath?)` - Handle successful authentication
- `handleAuthError(error?, redirectPath?)` - Handle authentication error
- `logout(redirectPath?)` - Logout user

#### useApi

Composable để gọi API qua proxy:

```typescript
import { useApi } from '~/composables/useApi';

const response = await useApi<{ accessToken: string }>('/auth/login', {
  method: 'POST',
  body: { email, password },
});
```

#### useForm

Composable để quản lý form state và validation:

```typescript
import { useForm } from '~/composables/useForm';

const { isSubmitting, error, success, handleSubmit, reset } = useForm<Schema>();
```

#### useApiLazy

Lazy version của useApi - trả về reactive state:

```typescript
import { useApiLazy } from '~/composables/useApi';

const { data, pending, error } = useApiLazy<{ users: User[] }>('/users');
```

## 🧪 Development

### Type Checking

```bash
yarn tsc
```

### Linting

```bash
yarn lint
```

### Hot Reload

Development server tự động reload khi có thay đổi.

## 🚢 Production

### Build

```bash
yarn build
```

Build output sẽ ở trong `.output/` folder.

### Preview

```bash
yarn preview
```

Preview production build locally.

### Start Production Server

```bash
yarn start
```

## 📦 Dependencies

### Core Dependencies

- `nuxt` - Nuxt.js framework
- `vue` - Vue.js
- `vue-router` - Vue Router
- `@nuxt/ui` - UI components
- `@nuxt/icon` - Icon system
- `@nuxt/fonts` - Font optimization
- `zod` - Schema validation

### Dev Dependencies

- `@nuxtjs/tailwindcss` - Tailwind CSS
- `@nuxt/eslint` - ESLint
- `typescript` - TypeScript
- `vue-tsc` - Vue TypeScript checker
- `vite` - Build tool
- `@vue/compiler-sfc` - Vue SFC compiler

## 🎨 Styling Guidelines

### Tailwind CSS

Sử dụng utility classes:

```vue
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h1 class="text-2xl font-bold text-gray-900">Title</h1>
</div>
```

### Custom CSS

Global styles trong `app/assets/css/main.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
```

### Components

Nuxt UI components:

```vue
<UButton color="primary">Click me</UButton>
<UInput v-model="email" placeholder="Email" />
<UCard>
  <p>Card content</p>
</UCard>
```

## 🔍 Best Practices

### Component Organization

1. **Composables**: Reusable logic trong `composables/`
2. **Components**: Reusable components trong `components/`
3. **Utils**: Utility functions trong `utils/`
4. **Types**: TypeScript types trong `types/`

### State Management

- Use `useState` cho local state
- Use `useCookie` cho persistent data
- Consider Pinia nếu cần complex state management

### Performance

- Lazy load components khi cần
- Optimize images
- Use Nuxt Image component
- Code splitting tự động

## 📚 Resources

- [Nuxt.js Documentation](https://nuxt.com/)
- [Nuxt UI Documentation](https://ui.nuxt.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vue.js Documentation](https://vuejs.org/)
