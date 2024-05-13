// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  colorMode: {
    classSuffix: ''
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/eslint-module',
    "@nuxtjs/supabase"
  ],
  shadcn: {
    /**
         * Prefix for all the imported component
         */
    prefix: '',
    /**
         * Directory that the component lives in.
         * @default "./components/ui"
         */
    componentDir: './components/ui'
  }
})