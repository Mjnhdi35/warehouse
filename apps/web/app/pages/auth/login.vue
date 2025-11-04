<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue';

definePageMeta({
  layout: 'auth',
  ssr: false,
});
</script>

<template>
  <LoginForm />
</template>
