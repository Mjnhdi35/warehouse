<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const { isAuthenticated, getAccessToken } = useAuth();

// Fetch user info if authenticated
const user = ref<{
  avatar?: string;
  displayName?: string;
  email?: string;
} | null>(null);
const loading = ref(false);

// Fetch user info when authenticated
const fetchUserInfo = async () => {
  if (!isAuthenticated.value) {
    user.value = null;
    loading.value = false;
    return;
  }

  if (user.value) {
    return; // Already fetched
  }

  loading.value = true;
  try {
    const token = getAccessToken();
    if (token.value) {
      const response = (await useApi('/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })) as {
        userId?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        displayName?: string;
        avatar?: string;
      };

      user.value = {
        email: response.email,
        displayName:
          response.displayName ||
          `${response.firstName || ''} ${response.lastName || ''}`.trim() ||
          response.email,
        avatar: response.avatar,
      };
    }
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    user.value = null;
  } finally {
    loading.value = false;
  }
};

// Watch authentication state
watch(isAuthenticated, fetchUserInfo, { immediate: true });

// Also fetch on mount (client-side only)
if (import.meta.client) {
  onMounted(() => {
    if (isAuthenticated.value && !user.value) {
      fetchUserInfo();
    }
  });
}

const navItems: NavigationMenuItem[] = [
  {
    label: 'Home',
    icon: 'i-lucide-home',
    to: '/',
  },
];

const footerItems: NavigationMenuItem[] = [];
</script>

<template>
  <UApp>
    <AppHeader :items="navItems">
      <!-- Auth Buttons or User Menu -->
      <template #user-menu>
        <ClientOnly>
          <UserMenu
            v-if="isAuthenticated"
            :avatar="user?.avatar"
            :display-name="user?.displayName"
            :email="user?.email"
            :loading="loading"
          />
          <AuthButtons v-else />
          <template #fallback>
            <USkeleton class="h-10 w-32" />
          </template>
        </ClientOnly>
      </template>
    </AppHeader>
    <UMain>
      <UContainer>
        <slot />
      </UContainer>
    </UMain>
    <USeparator class="h-px" />
    <AppFooter :items="footerItems" />
  </UApp>
</template>

<style scoped></style>
