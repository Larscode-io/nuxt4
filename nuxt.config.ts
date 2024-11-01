// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    }],
  $development: {
    runtimeConfig: {
      public: {
        redirectUri: process.env.REDIRECT_URI_DEV,
        apiBaseUrl: process.env.API_URL_DEV || 'https://node04.const-court.be:443',
      },
    },
  },
  $production: {
    runtimeConfig: {
      public: {
        redirectUri: process.env.REDIRECT_URI_PROD,
        apiBaseUrl: process.env.API_URL_PROD || 'https://node04.const-court.be:443',
      },
    },
  },
  ssr: false,
  devtools: { enabled: true },
  app: {
    baseURL: '/nuxt/',
  },
  content: { locales: ['en', 'fr', 'nl', 'de'] },
  runtimeConfig: {
    xapiBaseUrl: process.env.SERVER_API_BASE_URL || 'http://' + process.env.SERVERIP + ':' + process.env.SERVERPORT,
    authSecret: process.env.AUTH_SECRET,
    csamPass: process.env.CSAM_PASS,
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    solrLogin: process.env.SOLR_LOGIN,
    solrPassword: process.env.SOLR_PASSWORD,
    auDatabase: process.env.AU_DATABASE,
    auPassword: process.env.AU_PASSWORD,
    auServername: process.env.AU_SERVERNAME,
    auUsername: process.env.AU_USERNAME,
    fakeSecret: process.env.FAKE_SECRET,
    solrHost: process.env.SOLR_HOST,
    solrPort: process.env.SOLR_PORT,
    baseUrl: process.env.BASE_URL,
    fm1ProxyUrl: process.env.FM1_PROXY_URL,
    fm2ProxyUrl: process.env.FM2_PROXY_URL,
    public: {
      clientId: process.env.CLIENT_ID,
      csamUser: process.env.CSAM_USER,
      logoutRedirectUri: process.env.LOGOUT_REDIRECT_URI,
      csamBaseUrl: process.env.CSAM_BASE_URL,
      accessTokenUri: process.env.ACCESSTOKEN_URI,
      userinfoUri: process.env.USERINFO_URI,
      authorizeUri: process.env.AUTHORIZE_URI,
      tokeninfoUri: process.env.TOKENINFO_URI,
      introspectUri: process.env.INTROSPECT_URI,
      endSession: process.env.ENDSESSION,
      fakePublic: process.env.FAKE_PUBLIC,
      mailmanProxyUrl: process.env.MAILMAN_PROXY_URL,
    },
  },
  build: { transpile: ['vuetify'] },
  devServer: {
    host: 'localhost',
    port: 3000,
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-04-03',
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
          additionalData: `@use "@/assets/scss/colors.scss" as *;`,
        },
      },
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  // css: [ '~/assets/colors.scss', ],
  i18n: {
    vueI18n: './i18n.config.ts',
    lazy: true,
    langDir: 'lang/json',
    defaultLocale: 'nl',
    strategy: 'prefix',
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
      { code: 'fr', language: 'fr-FR', file: 'fr.json', name: 'Français' },
      { code: 'nl', language: 'nl-BE', file: 'nl.json', name: 'Nederlands' },
      { code: 'de', language: 'de-DE', file: 'de.json', name: 'Deutsch' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      fallbackLocale: 'fr',
      redirectOn: 'root',
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3001,
  },
})
