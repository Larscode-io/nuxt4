import { resolve } from 'path'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
  ],
  plugins: [
    '~/plugins/vuetify',
  ],
  $development: {
    runtimeConfig: {
      public: {
        redirectUri: import.meta.env.REDIRECT_URI_DEV,
        // Falling back to legacy server URL as long as the .env variable is not set.
        // This is to develop pages without the need to have api's ready (next step).
        // to run with another server, set the API_URL_DEV variable in the .env file or in the command line like this:
        // API_URL_DEV=http://localhost:3000 nuxt dev --port 3001
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
  ssr: true,
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  app: {
    baseURL: '/nuxt/',
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  css: [
    // Global stylesheets to be included in every page of our application
    'vuetify/lib/styles/main.sass',
    '@/assets/scss/main.scss',
    '@/assets/scss/fonts.scss',
    '@mdi/font/css/materialdesignicons.css',
  ],
  content: {
    build: {
      markdown: {
        toc: {
          depth: 3, // include h3 headings
        },
      },
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
    resolve: {
      alias: {
        '@core': resolve(__dirname, 'app/core'),
        '@utils': resolve(__dirname, 'app/utils'),
        '@types': resolve(__dirname, 'types'),
      },
    },
    server: {
      hmr: {
        overlay: false,
      },
    },
    define: {
      'process.env.DEBUG': false,
    },
    css: {
      // inject shared variables and mixins into all style files
      // only variables, mixins, and functions, and not for CSS rules
      // this is to avoid the need to import them in every style file
      // and only used at build time
      preprocessorOptions: {
        scss: {
          api: 'modern',
          additionalData: `
            @use "@/assets/scss/colors.scss" as *;
            @use "@/assets/scss/media.scss" as *;
          `,
        },
      },
    },
    vue: {
      template: {
        // To resolve relative asset URLs that are passed to Vuetify components
        transformAssetUrls,
      },
    },
    hooks: { // needed to extend the Vite config with Vuetify, needs to come after vue:
      'vite:extendConfig': (config: any) => {
        config.plugins.push(
          vuetify({
            autoImport: true,
            styles: {
              // override Vuetify's default SASS variables, enabling customization of Vuetify's component styles:
              configFile: 'assets/styles/vuetify.scss',
            },
          }),
        )
      },
    },
    ssr: {
      noExternal: ['vuetify'],
    },
  },
  i18n: {
    vueI18n: './i18n.config.ts',
    lazy: true,
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
