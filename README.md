  ## Migration from Nuxt 2 to Nuxt 3 with compatibilityVersion 4
  <img src="./assets/img/ScreenshotHome.png" alt="Screenshot Home page" height="600">

  ### Prerequisites
  - Node.js version >= 18.0.0
  - npm (Node Package Manager)
  - Initialize a Git repository for version control
  - Ubuntu 20.04.6 LTS server

  ### Considerations
  - **Nuxt version**: Conform to `compatibilityVersion: 4`.
  - **built-in server**: Migrate from `fastify.js` to the Nuxt 3 built-in server.
  - **Pinia Store**: Migrate from Vuex to `Pinia`.
  - **MariaDB**: use Knex.
  - **Filemaker**: implement session token an queries with Pinia for a limited number of pages.
  - **UI Framework**: keep Vuetify.
  - **Axios**: Drop if possible and use `useFetch`, `useAsyncData` and `$fetch`.
  - **vee-validate & vuelidate**: drop it because of limited use.
  - **cookie-universal & cookie-universal-nuxt**: drop it.

  ### Migration Strategy
  1. **Probably the most challenging**:
        - **i18n**: Set up internationalization to maintain multi-language support.
        - **@nuxt/content**: Nuxt 3's Content module (@nuxt/content) has evolved significantly, f.ex. locale support.
        - **Fastify routes**: Port to Nuxt API routes.
        - **MySQL**: using Knex with Nuxt 3
        - **Solr** integration
        - **Auth**: Authentication module CSAM
        

  2. **Plugins and Middleware**:
        Limited in scope

  3. **Next Steps**:
    - **Components and Pages**
    - **Composition API**: rewrite pages in Options API syntax.
    - **Unit tests, Integration tests, and End-to-end (E2E) tests**: Vue Test Utils, Vitest, Cypress

## WIP with scripts
  - [X] Replace and add: nuxt.config.ts, app.vue, layouts/default.vue, pages/index.vue.
  - [X] Create v4 folder structure. The `public` directory is now `static`. The  `assets` folder is now `app/assets`. Copy files over.
  - [ ] Issues with linked images using `static` within CSS: you may need to use absolute links to the images in the `public` directory.
  - [X] Copy .env
  - [ ] If needed, update nuxt config with `css: ['~/assets/main.css',...]`.
  - [ ] Install tools: ESLint
  - [X] Install modules: Pinea, i18n, knex (later Solr, ...)
  - [ ] `Preprocessor dependency "sass" not found. Did you install it?` then try `npm install -D sass`
  - [X] Runtime Config & env for production and development
  - [ ] const route = `useRoute()`
  - [ ] install a navbar and test routing
  - [ ] move components from 2 => 3

## Migration from Nuxt 2 to Nuxt 3  including Composition API and `script setup`.

[Image of Home Page]

### Prerequisites

* Node.js >= 18.0.0
* npm 
* Git repository
* Ubuntu 20.04.6 LTS server

### Migration Considerations

* **Nuxt:** `compatibilityVersion: 4`
* **API Server:** Migrate Fastify to Nuxt 3's built-in Nitro server
* **State Management:** migrate from Vuex to Pinia
* **Databases:** MariaDB with Knex and Filemaker API
* **UI:** Upgrade Vuetify versus Tailwind
* **Data Fetching:** Replace Axios with built-in `useFetch`, `useAsyncData`, `$fetch`
* **Validation:** Drop vee-validate & vuelidate
* **Cookies:** Drop cookie-universal & cookie-universal-nuxt
* **.env**: replace `.env.production` and `.env.development` with a single `.env` file and utilize runtime variables on server to simplify DX

### Migration Strategy

1. **Key Challenges**
    * **i18n:** Implement for multi-language support
    * **@nuxt/content:** Adapt to Nuxt 3's Content module changes
    * **UI:** Upgrade Vuetify to latest version
    * **Routing:** Port Fastify routes to Nuxt API routes
    * **Database:** Integrate MySQL using Knex
    * **Juportal:** API for the Juportal robot
    * **Search:** Solr integration
    * **Auth:** CSAM authentication

2. **Plugins and Middleware**
    * Limited in scope, address as needed

3. **Next Steps**
    * **Components and Pages:** Migrate and adapt to Nuxt 3
    * **Composition API:** Convert Options API
    * **Testing:** Implement unit, integration, and E2E tests (Vue Test Utils, Vitest, Cypress)

## Work in Progress

- **Install Nuxt 3 with Compatibility Version 4**
  - [X] Create the folder structure: move `public` to `static`, and `assets` to `app/assets`.
  - [X] Set up basic files: `app.vue`, `layouts/default.vue`, and `pages/index.vue`.
  
- **Configuration and Setup**
  - [X] Configure `runtimeConfig` in `nuxt.config.ts`.
  - [X] Use a unified `.env` file for both production and development environments.
  
- **Installations and Testing**
  - [X] Install and test i18n for internationalization.
  - [X] Enable i18n `.json` translation file based autocompletion in VS Code.
  - [X] Install and test Knex for MySQL database integration.
  - [X] Set up and test middleware for FileMaker API access and token management.

- **Automation and Integration**
  - [X] Write a Bash script for automatic installation of the above components.
  - [X] Set up a GitHub webhook for automated production builds.

- **Routing and Layout**
  - [ ] Implement routing and test with a navigation bar.
  
- **Code Quality and Tools**
  - [ ] Update `nuxt.config.ts` with CSS paths if necessary.
  - [ ] Install ESLint for code linting.
  
- **Additional Installations**
  - [ ] Install and configure Solr.
  - [ ] Install Sass (`npm install -D sass`) if needed.

- **Image and Asset Handling**
  - [ ] Resolve issues with linked images in CSS by using the `static` directory when required.

- **Component Migration**
  - [ ] Migrate Nuxt 2 components to Nuxt 3. Consider using AI assistance.

 ### References

- [Nuxt 2 to Nuxt 3 Migration Guide: Official Nuxt doc](https://nuxt.com/docs/migration/overview)  
  Official Nuxt documentation covering the key steps for migrating from Nuxt 2 to Nuxt 3.

- [Migration Nuxt 2 to Nuxt 3 by b-barry](https://github.com/mirahi-io/migration-nuxt-2-to-nuxt-3/tree/main/nuxt-3-starting/exercise)  
  A helpful repository providing code examples and exercises for migrating a project from Nuxt 2 to Nuxt 3.

- [Migrating from Nuxt 2 to Nuxt 3 by Debbie O'Brien](https://debbie.codes/blog/migrating-nuxt2-nuxt3/)  
  A detailed blog post by Debbie O'Brien, walking through the challenges and solutions involved in migrating from Nuxt 2 to Nuxt 3.
  
- [Vuetify Upgrade Guide](https://vuetifyjs.com/en/getting-started/upgrade-guide/#setup)  
  Comprehensive guide for upgrading from Vuetify 2 to Vuetify 3, covering setup, new features, and breaking changes.
>>>>>>> 5731820637af4974264f9f70c8ccd17327e66c52
