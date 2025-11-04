<script setup lang="ts">
const { isAuthenticated } = useAuth();
const router = useRouter();

const goToLogin = () => {
  router.push('/auth/login');
};

const goToRegister = () => {
  router.push('/auth/register');
};
</script>

<template>
  <div v-if="!isAuthenticated" class="flex items-center gap-2">
    <!-- Login Button -->
    <UButton
      variant="ghost"
      color="neutral"
      icon="i-lucide-log-in"
      @click="goToLogin"
    >
      Đăng nhập
    </UButton>

    <!-- Register Button -->
    <UButton
      color="primary"
      icon="i-lucide-user-plus"
      @click="goToRegister"
    >
      Đăng ký
    </UButton>
  </div>
</template>

