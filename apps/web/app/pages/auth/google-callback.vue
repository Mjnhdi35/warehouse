<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  ssr: false,
});

const route = useRoute();
const { setAccessToken, handleAuthSuccess, handleAuthError } = useAuth();

onMounted(async () => {
  try {
    const token = route.query.token as string | undefined;
    const error = route.query.error as string | undefined;

    if (error) {
      handleAuthError(error || 'Có lỗi xảy ra khi đăng nhập với Google');
      return;
    }

    if (token) {
      setAccessToken(token);

      await navigateTo('/auth/google-callback?success=true', {
        replace: true,
      });
      handleAuthSuccess(token, 'Đăng nhập với Google thành công!');
    } else {
      await navigateTo('/auth/login');
    }
  } catch (err) {
    handleAuthError('Có lỗi xảy ra');
  }
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"
      ></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">
        Đang xử lý đăng nhập với Google...
      </p>
    </div>
  </div>
</template>
