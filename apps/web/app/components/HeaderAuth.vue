<script setup lang="ts">
const { isAuthenticated } = useAuth();
const { user, loading } = useUser();
</script>

<template>
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
