<script setup lang="ts"></script>

<template>
  <UApp>
    <div
      class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-2 lg:px-4"
    >
      <div class="max-w-md w-full">
        <!-- Logo -->
        <div class="text-center mb-2">
          <Logo
            to="/"
            size="lg"
            class="justify-center"
            image="/assets/images/plant1.svg"
          />
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
