<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

interface Props {
  /**
   * User avatar URL
   */
  avatar?: string;
  /**
   * User display name
   */
  displayName?: string;
  /**
   * User email
   */
  email?: string;
  /**
   * Menu items for user dropdown
   */
  items?: NavigationMenuItem[];
  /**
   * Show loading skeleton
   */
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  avatar: undefined,
  displayName: undefined,
  email: undefined,
  items: () => [],
  loading: false,
});

const isOpen = ref(false);

const { logout } = useAuth();

const defaultItems: NavigationMenuItem[] = [
  {
    label: 'Profile',
    icon: 'i-lucide-user',
    to: '/profile',
  },
  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    to: '/settings',
  },
];

const menuItems = computed(() => {
  return props.items.length > 0 ? props.items : defaultItems;
});

const handleLogout = () => {
  logout();
  isOpen.value = false;
};

const userInitials = computed(() => {
  if (!props.displayName) return 'U';
  const trimmedName = props.displayName.trim();
  if (!trimmedName) return 'U';

  const names = trimmedName.split(/\s+/).filter(Boolean);
  if (names.length >= 2) {
    const first = names[0];
    const last = names[names.length - 1];
    if (first && last && first[0] && last[0]) {
      return `${first[0]}${last[0]}`.toUpperCase();
    }
  }

  const firstChar = trimmedName[0];
  return firstChar ? firstChar.toUpperCase() : 'U';
});
</script>

<template>
  <div class="relative">
    <!-- Loading Skeleton -->
    <USkeleton v-if="loading" class="h-10 w-10 rounded-full" />

    <!-- User Avatar Button -->
    <UButton
      v-else
      variant="ghost"
      color="neutral"
      :aria-label="displayName || 'User menu'"
      @click="isOpen = !isOpen"
    >
      <UAvatar
        :src="avatar"
        :alt="displayName || 'User'"
        :text="userInitials"
        size="sm"
      />
    </UButton>

    <!-- User Dropdown Menu -->
    <UCard
      v-if="isOpen && !loading"
      class="absolute right-0 top-full mt-2 w-56 z-50"
      @click-outside="isOpen = false"
    >
      <div class="p-4 border-b border-default">
        <div v-if="displayName" class="font-semibold text-sm">
          {{ displayName }}
        </div>
        <div v-if="email" class="text-xs text-gray-500 dark:text-gray-400">
          {{ email }}
        </div>
      </div>

      <div class="p-2">
        <UNavigationMenu :items="menuItems" orientation="vertical" />
        <!-- Logout button (separate) -->
        <div class="mt-2 pt-2 border-t border-default">
          <UButton
            variant="ghost"
            color="error"
            icon="i-lucide-log-out"
            class="w-full justify-start"
            @click="handleLogout"
          >
            Sign Out
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
