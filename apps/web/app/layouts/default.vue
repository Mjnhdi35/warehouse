<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

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
    <AppHeader :items="navItems" />
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
