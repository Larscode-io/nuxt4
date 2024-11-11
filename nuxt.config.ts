import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    // configure Vite to use Vuetify as a plugin
    // (_options, nuxt) => {
    //   nuxt.hooks.hook('vite:extendConfig', (config) => {
    //     config.plugins?.push(
    //       vuetify({ autoImport: true }))
    //   })
    // },
  ],
  plugins: [
    '~/plugins/vuetify',
  ],
  $development: {
    runtimeConfig: {
      public: {
        redirectUri: import.meta.env.REDIRECT_URI_DEV,
        apiBaseUrl: import.meta.env.API_URL_DEV || 'https://node04.const-court.be:443',
      },
    },
  },
  $production: {
    runtimeConfig: {
      public: {
        redirectUri: import.meta.env.REDIRECT_URI_PROD,
        apiBaseUrl: import.meta.env.API_URL_PROD || 'https://node04.const-court.be:443',
      },
    },
  },
  ssr: false,
  devtools: { enabled: true },
  app: {
    baseURL: '/nuxt/',
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  css: [
    // 'vuetify/lib/styles/main.sass',
    'vuetify/styles',
    '~/assets/css/fonts.css',
    '~/assets/scss/vuetify-variables.scss',
    '@mdi/font/css/materialdesignicons.css', // MDI icons

  ],
  // content: { locales: ['en', 'fr', 'nl', 'de'] },
  content: {
    markdown: {
      remarkPlugins: [],
      rehypePlugins: [],
      // Enable Vue components in Markdown
      mdc: true,
    },
  },
  runtimeConfig: {
    xapiBaseUrl: import.meta.env.SERVER_API_BASE_URL || 'http://' + import.meta.env.SERVERIP + ':' + import.meta.env.SERVERPORT,
    authSecret: import.meta.env.AUTH_SECRET,
    csamPass: import.meta.env.CSAM_PASS,
    dbHost: import.meta.env.DB_HOST,
    dbUser: import.meta.env.DB_USER,
    dbPassword: import.meta.env.DB_PASSWORD,
    dbName: import.meta.env.DB_NAME,
    solrLogin: import.meta.env.SOLR_LOGIN,
    solrPassword: import.meta.env.SOLR_PASSWORD,
    auDatabase: import.meta.env.AU_DATABASE,
    auPassword: import.meta.env.AU_PASSWORD,
    auServername: import.meta.env.AU_SERVERNAME,
    auUsername: import.meta.env.AU_USERNAME,
    fakeSecret: import.meta.env.FAKE_SECRET,
    solrHost: import.meta.env.SOLR_HOST,
    solrPort: import.meta.env.SOLR_PORT,
    baseUrl: import.meta.env.BASE_URL,
    fm1ProxyUrl: import.meta.env.FM1_PROXY_URL,
    fm2ProxyUrl: import.meta.env.FM2_PROXY_URL,
    public: {
      clientId: import.meta.env.CLIENT_ID,
      csamUser: import.meta.env.CSAM_USER,
      logoutRedirectUri: import.meta.env.LOGOUT_REDIRECT_URI,
      csamBaseUrl: import.meta.env.CSAM_BASE_URL,
      accessTokenUri: import.meta.env.ACCESSTOKEN_URI,
      userinfoUri: import.meta.env.USERINFO_URI,
      authorizeUri: import.meta.env.AUTHORIZE_URI,
      tokeninfoUri: import.meta.env.TOKENINFO_URI,
      introspectUri: import.meta.env.INTROSPECT_URI,
      endSession: import.meta.env.ENDSESSION,
      fakePublic: import.meta.env.FAKE_PUBLIC,
      mailmanProxyUrl: import.meta.env.MAILMAN_PROXY_URL,
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
    server: {
      hmr: {
        overlay: false,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
          additionalData: `
            @use "@/assets/scss/colors.scss" as *;
            @use "@/assets/scss/fonts.scss" as *;
            @use "@/assets/scss/media.scss" as *;
          `,
        },
      },
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    ssr: {
      noExternal: ['vuetify'],
    },
  },
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
