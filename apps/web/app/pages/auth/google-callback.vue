<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  ssr: false,
});

const route = useRoute();
const { setAccessToken, handleAuthSuccess, handleAuthError } = useAuth();
const { t } = useI18n();

onMounted(async () => {
  try {
    const token = route.query.token as string | undefined;
    const error = route.query.error as string | undefined;

    if (error) {
      handleAuthError(error || t('auth.signInWithGoogleError'));
      return;
    }

    if (token) {
      setAccessToken(token);

      await navigateTo('/auth/google-callback?success=true', {
        replace: true,
      });
      handleAuthSuccess(token);
    } else {
      await navigateTo('/auth/login');
    }
  } catch (error: any) {
    handleAuthError(t('auth.anErrorOccurred'));
  }
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"
      />
      <p class="mt-4 text-gray-600 dark:text-gray-400">
        {{ t('auth.processingGoogleSignIn') }}
      </p>
    </div>
  </div>
</template>
