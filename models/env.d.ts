/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SERVER_API_BASE_URL: string
  readonly SERVERIP: string
  readonly SERVERPORT: string
  readonly AUTH_SECRET: string
  readonly CSAM_PASS: string
  readonly DB_HOST: string
  readonly DB_USER: string
  readonly DB_PASSWORD: string
  readonly DB_NAME: string
  readonly SOLR_LOGIN: string
  readonly SOLR_PASSWORD: string
  readonly AU_DATABASE: string
  readonly AU_PASSWORD: string
  readonly AU_SERVERNAME: string
  readonly AU_USERNAME: string
  readonly FAKE_SECRET: string
  readonly SOLR_HOST: string
  readonly SOLR_PORT: string
  readonly BASE_URL: string
  readonly FM1_PROXY_URL: string
  readonly FM2_PROXY_URL: string
  readonly CLIENT_ID: string
  readonly CSAM_USER: string
  readonly LOGOUT_REDIRECT_URI: string
  readonly CSAM_BASE_URL: string
  readonly ACCESSTOKEN_URI: string
  readonly USERINFO_URI: string
  readonly AUTHORIZE_URI: string
  readonly TOKENINFO_URI: string
  readonly INTROSPECT_URI: string
  readonly ENDSESSION: string
  readonly FAKE_PUBLIC: string
  readonly MAILMAN_PROXY_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
