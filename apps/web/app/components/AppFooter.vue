<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

interface Props {
  /**
   * Footer navigation menu items (center)
   */
  items?: NavigationMenuItem[];
  /**
   * Copyright text
   */
  copyright?: string;
  /**
   * Show copyright year
   */
  showYear?: boolean;
  /**
   * Custom copyright text (overrides default)
   */
  copyrightText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  copyright: 'Warehouse',
  showYear: true,
  copyrightText: undefined,
});

const currentYear = new Date().getFullYear();

const copyrightText = computed(() => {
  if (props.copyrightText) {
    return props.copyrightText;
  }
  if (props.showYear) {
    return `Copyright © ${currentYear} ${props.copyright}`;
  }
  return `Copyright © ${props.copyright}`;
});
</script>

<template>
  <UFooter>
    <!-- Left: Copyright -->
    <template #left>
      <p class="text-muted text-sm">
        {{ copyrightText }}
      </p>
    </template>

    <!-- Center: Navigation Menu -->
    <UNavigationMenu v-if="items.length > 0" :items="items" variant="link" />

    <!-- Right: Social Links or Actions -->
    <template #right>
      <slot name="right" />
    </template>
  </UFooter>
</template>
