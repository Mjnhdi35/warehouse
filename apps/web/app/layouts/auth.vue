<script setup lang="ts"></script>

<template>
  <UApp>
    <div
      class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full">
        <!-- Logo -->
        <div class="text-center mb-8">
          <Logo to="/" size="lg" class="justify-center" />
        </div>

        <!-- Auth Form -->
        <UPageCard class="w-full">
          <slot />
        </UPageCard>
      </div>
    </div>
  </UApp>
</template>

<style scoped></style>
