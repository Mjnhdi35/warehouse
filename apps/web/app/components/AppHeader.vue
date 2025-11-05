<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

interface Props {
  /**
   * Navigation menu items
   */
  items?: NavigationMenuItem[];
  /**
   * Logo text
   */
  logoText?: string;
  /**
   * Logo icon
   */
  logoIcon?: string;
  /**
   * Logo image
   */
  logoImage?: string;
  /**
   * Logo link
   */
  logoTo?: string;
  /**
   * Show color mode button
   */
  showColorMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  logoText: 'Fresh Shop',
  logoTo: '/',
  showColorMode: true,
  logoImage: '/assets/images/plant1.svg',
});

const route = useRoute();

const navigationItems = computed<NavigationMenuItem[]>(() => {
  if (!import.meta.client) {
    return props.items;
  }

  return props.items.map((item) => {
    let isActive = false;
    if (item.active !== undefined) {
      isActive = item.active;
    } else if (item.to && typeof item.to === 'string') {
      isActive = route.path.startsWith(item.to);
    }
    return {
      ...item,
      active: isActive,
    };
  });
});
</script>

<template>
  <UHeader>
    <template #title>
      <Logo
        :text="logoText"
        :icon="logoIcon"
        :image="logoImage"
        :to="logoTo"
        size="lg"
      />
    </template>

    <!-- Navigation Menu (Center) - Desktop -->
    <UNavigationMenu
      v-if="navigationItems.length > 0"
      :items="navigationItems"
    />

    <!-- Right Side Actions -->
    <template #right>
      <!-- User Menu -->
      <slot name="user-menu" />

      <!-- Color Mode Button -->
      <ColorModeButton v-if="showColorMode" />

      <!-- Additional right side content -->
      <slot name="right" />
    </template>

    <!-- Mobile Menu Body -->
    <template v-if="navigationItems.length > 0" #body>
      <UNavigationMenu
        :items="navigationItems"
        orientation="vertical"
        class="-mx-2.5"
      />
    </template>
  </UHeader>
</template>
