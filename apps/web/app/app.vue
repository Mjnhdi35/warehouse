<script setup lang="ts">
const { setAppLocale } = useI18n();

// Load and extend English locale with custom messages
const locale = await (async () => {
  const enLocale = await import('~/locales/en');
  return enLocale.default;
})();

// Set locale for UApp and useI18n
setAppLocale(locale);

// Set HTML lang and dir attributes
useHead({
  htmlAttrs: {
    lang: locale.code,
    dir: locale.dir || 'ltr',
  },
});
</script>

<template>
  <UApp :locale="locale">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
