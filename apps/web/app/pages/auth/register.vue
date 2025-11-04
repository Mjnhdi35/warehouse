<script setup lang="ts">
import RegisterForm from '~/components/auth/RegisterForm.vue';

definePageMeta({
  layout: 'auth',
  ssr: false,
});
</script>

<template>
  <RegisterForm />
</template>
