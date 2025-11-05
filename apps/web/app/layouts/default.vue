<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const { t } = useI18n();

// Use static array for SSR consistency, then update on client
const navItems = useState<NavigationMenuItem[]>('nav-items', () => [
  {
    label: 'Home', // Default label for SSR
    icon: 'i-lucide-home',
    to: '/',
  },
]);

// Update label on client when locale is ready
if (import.meta.client) {
  watch(
    () => t('common.home'),
    (homeLabel) => {
      if (navItems.value[0]) {
        navItems.value[0].label = homeLabel || 'Home';
      }
    },
    { immediate: true },
  );
}

const footerItems: NavigationMenuItem[] = [];
</script>

<template>
  <UApp>
    <AppHeader :items="navItems">
      <!-- Auth Buttons or User Menu -->
      <template #user-menu>
        <HeaderAuth />
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
