// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  server: {
    host: "0.0.0.0",
    port: 3001
  },
  devServer: {
    host: "0.0.0.0",
    port: 3001
  },
  runtimeConfig: {
    xapiBaseUrl: process.env.SERVER_API_BASE_URL || "http://" + process.env.SERVERIP + ":" + process.env.SERVERPORT,
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
    apiBaseUrl: process.env.API_URL,
    baseUrl: process.env.BASE_URL,
    fm1ProxyUrl: process.env.FM1_PROXY_URL,
    fm2ProxyUrl: process.env.FM2_PROXY_URL,
    public: {
      clientId: process.env.CLIENT_ID,
      csamUser: process.env.CSAM_USER,
      logoutRedirectUri: process.env.LOGOUT_REDIRECT_URI,
      redirectUri: process.env.REDIRECT_URI,
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
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true }
})
