# Frontend Tech Stack: Nuxt, Nuxt UI, Tailwind CSS v4

Tài liệu về các công nghệ frontend được sử dụng trong dự án Warehouse.

## 📋 Mục lục

- [Nuxt.js](#nuxtjs)
- [Nuxt UI](#nuxt-ui)
- [Tailwind CSS v4](#tailwind-css-v4)
- [Best Practices](#best-practices)
- [Resources](#resources)

---

## 🚀 Nuxt.js

### Giới thiệu

Nuxt.js là một framework Vue.js tiến bộ để xây dựng các ứng dụng web hiện đại. Nuxt 4 cung cấp SSR (Server-Side Rendering), SSG (Static Site Generation), và các tính năng mạnh mẽ khác.

### Cấu trúc dự án

```
apps/web/app/
├── components/      # Reusable components
├── composables/     # Vue composables
├── layouts/         # Layout components
├── pages/           # Route pages
├── middleware/      # Route middleware
├── plugins/         # Nuxt plugins
├── server/          # Server routes (API)
│   ├── api/
│   └── middleware/
└── assets/          # Static assets
```

### Pages & Routing

Nuxt tự động tạo routes từ file structure:

```typescript
// pages/index.vue → /
// pages/about.vue → /about
// pages/users/[id].vue → /users/:id
// pages/users/index.vue → /users
```

```vue
<!-- pages/users/[id].vue -->
<script setup lang="ts">
const route = useRoute();
const userId = route.params.id;
</script>

<template>
  <div>User ID: {{ userId }}</div>
</template>
```

### Layouts

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>

<!-- pages/about.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'default',
});
</script>
```

### Composables

```typescript
// composables/useAuth.ts
export const useAuth = () => {
  const user = useState('user', () => null);
  const token = useCookie('accessToken');

  const login = async (email: string, password: string) => {
    const response = await useApi('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    token.value = response.accessToken;
    return response;
  };

  const logout = () => {
    token.value = null;
    user.value = null;
  };

  return {
    user,
    token,
    login,
    logout,
  };
};
```

### Server Routes

```typescript
// server/api/users/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const user = await getUserById(id);
  return user;
});
```

### Middleware

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('accessToken');

  if (!token.value && to.path !== '/auth/login') {
    return navigateTo('/auth/login');
  }
});
```

### State Management

```typescript
// Using useState (reactive state)
const count = useState('count', () => 0);

// Using useCookie (persistent state)
const token = useCookie('accessToken', {
  maxAge: 60 * 60 * 24 * 7,
  secure: true,
  sameSite: 'strict',
});
```

### Auto-imports

Nuxt tự động import:

- `useState`, `useCookie`, `useRouter`, `useRoute`
- `navigateTo`, `useFetch`, `$fetch`
- `definePageMeta`, `defineNuxtConfig`
- Components từ `components/`
- Composables từ `composables/`

---

## 🎨 Nuxt UI

### Giới thiệu

Nuxt UI là một component library được xây dựng trên Tailwind CSS và Headless UI, cung cấp các components Vue.js đẹp và có thể tùy chỉnh.

### Installation

```bash
yarn add @nuxt/ui
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
});
```

### Components

#### Button

```vue
<UButton color="primary" size="lg" variant="solid">
  Click me
</UButton>

<UButton icon="i-lucide-heart" variant="ghost" />
```

#### Input

```vue
<UInput
  v-model="email"
  type="email"
  placeholder="Email"
  icon="i-lucide-mail"
  size="lg"
/>
```

#### Form

```vue
<UForm :state="form" @submit="handleSubmit">
  <UFormGroup label="Email" name="email" required>
    <UInput v-model="form.email" type="email" />
  </UFormGroup>
  
  <UButton type="submit">Submit</UButton>
</UForm>
```

#### Alert

```vue
<UAlert
  color="error"
  variant="soft"
  title="Error"
  description="Something went wrong"
  icon="i-lucide-alert-circle"
/>
```

#### Card

```vue
<UCard>
  <template #header>
    <h3>Card Title</h3>
  </template>
  
  <p>Card content</p>
  
  <template #footer>
    <UButton>Action</UButton>
  </template>
</UCard>
```

#### Modal

```vue
<UModal v-model="isOpen">
  <UCard>
    <template #header>
      <h3>Modal Title</h3>
    </template>
    
    <p>Modal content</p>
  </UCard>
</UModal>
```

#### Navigation

```vue
<UNavigationMenu
  :items="[
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
  ]"
/>
```

#### Header & Footer

```vue
<UHeader>
  <template #title>
    <Logo />
  </template>
  
  <UNavigationMenu :items="navItems" />
  
  <template #right>
    <UButton icon="i-lucide-user" />
  </template>
</UHeader>

<UFooter>
  <template #left>
    <p>Copyright © 2025</p>
  </template>
  
  <template #right>
    <UButton icon="i-lucide-github" />
  </template>
</UFooter>
```

### Icons

Nuxt UI sử dụng `@nuxt/icon`:

```vue
<Icon name="i-lucide-home" />
<Icon name="i-lucide-user" class="w-6 h-6" />
```

### Colors & Themes

```typescript
// app.config.ts
export default defineAppConfig({
  ui: {
    primary: 'blue',
    gray: 'slate',
  },
});
```

### Dark Mode

```vue
<UColorModeButton />
```

```typescript
const colorMode = useColorMode();
colorMode.preference = 'dark';
```

---

## 🎨 Tailwind CSS v4

### Giới thiệu

Tailwind CSS v4 là phiên bản mới nhất của utility-first CSS framework, với nhiều cải tiến về performance và developer experience.

### Installation

```bash
yarn add -D tailwindcss@next
```

```css
/* assets/css/main.css */
@import 'tailwindcss';
```

### Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
});
```

### Utility Classes

```vue
<template>
  <!-- Spacing -->
  <div class="p-4 m-2 space-y-4">
    <!-- Flexbox -->
    <div class="flex items-center justify-between gap-4">
      <!-- Colors -->
      <div class="bg-blue-500 text-white dark:bg-blue-600">
        <!-- Typography -->
        <h1 class="text-2xl font-bold">Title</h1>
        <p class="text-gray-600 dark:text-gray-400">Description</p>
      </div>
    </div>
  </div>
</template>
```

### Responsive Design

```vue
<div class="
  grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
  gap-4
">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Dark Mode

```vue
<div class="bg-white dark:bg-gray-800">
  <p class="text-gray-900 dark:text-white">Content</p>
</div>
```

### Custom Utilities

```css
/* assets/css/main.css */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### CSS Variables

```css
/* Using CSS variables */
:root {
  --color-primary: 59 130 246; /* blue-500 */
}

.button {
  background-color: rgb(var(--color-primary));
}
```

### Container

```vue
<UContainer>
  <div>Content</div>
</UContainer>
```

---

## ✅ Best Practices

### Nuxt.js

1. **File-based Routing**: Sử dụng file structure cho routing
2. **Auto-imports**: Tận dụng auto-imports thay vì manual imports
3. **Composables**: Tách logic thành composables
4. **Server Routes**: Sử dụng server routes cho API endpoints
5. **SEO**: Sử dụng `useSeoMeta` và `useHead` cho SEO
6. **Performance**: Lazy load components và images

### Nuxt UI

1. **Component Composition**: Sử dụng slots và props
2. **Accessibility**: Components đã có sẵn accessibility
3. **Theming**: Customize theme trong `app.config.ts`
4. **Icons**: Sử dụng consistent icon naming
5. **Forms**: Sử dụng UForm với validation

### Tailwind CSS

1. **Utility First**: Sử dụng utility classes thay vì custom CSS
2. **Responsive**: Mobile-first approach
3. **Dark Mode**: Luôn support dark mode
4. **Performance**: Sử dụng JIT mode (mặc định trong v4)
5. **Customization**: Extend theme trong config

---

## 📚 Resources

### Nuxt.js

- [Nuxt 4 Documentation](https://nuxt.com/docs)
- [Nuxt GitHub](https://github.com/nuxt/nuxt)
- [Nuxt Modules](https://nuxt.com/modules)

### Nuxt UI

- [Nuxt UI Documentation](https://ui.nuxt.com/)
- [Nuxt UI GitHub](https://github.com/nuxt/ui)
- [Nuxt UI Components](https://ui.nuxt.com/components)

### Tailwind CSS

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS GitHub](https://github.com/tailwindlabs/tailwindcss)
- [Tailwind CSS Playground](https://play.tailwindcss.com/)

---

## 🔧 Common Patterns

### Data Fetching

```vue
<script setup lang="ts">
// Using useFetch (SSR)
const { data, pending, error } = await useFetch('/api/users');

// Using useLazyFetch (client-side)
const { data, pending } = useLazyFetch('/api/users');

// Using useApi composable
const users = await useApi('/users');
</script>
```

### Form Handling

```vue
<script setup lang="ts">
const form = ref({
  email: '',
  password: '',
});

const handleSubmit = async () => {
  try {
    await useApi('/auth/login', {
      method: 'POST',
      body: form.value,
    });
  } catch (error) {
    // Handle error
  }
};
</script>
```

### Navigation

```vue
<script setup lang="ts">
const router = useRouter();

// Navigate
await router.push('/about');

// Using navigateTo
await navigateTo('/about');
</script>
```

---

_Last updated: 2025_
