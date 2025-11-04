// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  ssr: true,

  typescript: {
    typeCheck: true,
  },

  css: ['~/assets/css/main.css'],

  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/icon', '@nuxt/fonts'],

  runtimeConfig: {
    apiBaseUrl: process.env.API_BASE_URL!,
  },
});
