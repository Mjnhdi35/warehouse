// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  ssr: true,

  typescript: {
    typeCheck: true,
  },

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/image',
  ],

  fonts: {
    families: [
      {
        name: 'Poppins',
        provider: 'google',
        weights: ['300', '400', '500', '600', '700'],
        styles: ['normal'],
      },
      {
        name: 'Inter',
        provider: 'google',
        weights: ['400', '500', '600'],
        styles: ['normal'],
      },
    ],
  },

  runtimeConfig: {
    apiBaseUrl: process.env.API_BASE_URL!,
  },
});