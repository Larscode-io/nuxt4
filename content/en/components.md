---
title: Component Structure Overview
description: Explanation of the structure and reasoning behind app.vue, ContentPage.vue, and BannerImage.vue
date: 2025-05-10
tags:
  - architecture
  - documentation
  - nuxt
  - vue
  - components
---

# Component Structure Documentation

Here’s a detailed explanation of how and why we structured `app.vue`, `ContentPage.vue`, and `BannerImage.vue` in your project. This documentation will help future developers understand the reasoning behind these decisions.

---

## 1. `app.vue`

### Purpose
`app.vue` is the top-level component in a Nuxt application. It wraps all pages and layouts, providing a consistent structure for the application.

### Current Implementation

```
<template>
  <NuxtLayout>
    <header />
    <v-app>
      <NuxtPage class="d-flex flex-column" />
    </v-app>
    <footer />
  </NuxtLayout>
</template>

<style scoped>
.nuxt-page-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%; /* Ensures child components can span full width */
}
</style>
```

#### Why This Structure?

- **NuxtLayout**
  - Wraps the application with a layout system, allowing for reusable layouts across pages.
  - Ensures that the header and footer are consistent across all pages.

- **v-app**
  - Part of Vuetify, it provides a container for the application and ensures proper styling and responsiveness.

- **NuxtPage**
  - Dynamically renders the current page component.
  - The `d-flex flex-column` class ensures that the page content is displayed in a column layout and takes up the full height of the viewport.

- **Flexibility**
  - By applying classes like `d-flex flex-column` to `NuxtPage`, we ensure that the layout is flexible and can adapt to different page designs.

---

## 2. `ContentPage.vue`

### Purpose
`ContentPage.vue` is a reusable component designed to render content dynamically. It handles:

- Fetching content based on the `contentPath` prop.
- Displaying a `BannerImage` at the top of the page.
- Rendering a sidebar and main content area.

### Current Implementation

```
<template>
  <div>
    <div class="banner-wrapper">
      <BannerImage
        v-if="!hideImage && !pending && page"
        :title="page?.title || ''"
        :description="page?.description"
        :image="img"
        alt=""
      />
    </div>
    <v-container class="flex-column align-start flex-nowrap">
      <v-row>
        <v-col
          v-if="hasSidebarLinks"
          cols="12"
          md="4"
        >
          <SideBar
            :active="currentActiveContentInToc"
            :toc="sideBarLinks"
            @click="updateCurrentActiveContentInToc"
          />
        </v-col>
        <v-col
          cols="12"
          :md="hasSidebarLinks ? 8 : 12"
        >
          <article v-if="page">
            <ContentRendererMarkdown
              :value="page.body || {}"
              class="nuxt-content content-renderer"
            />
          </article>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.banner-wrapper {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}
</style>
```

#### Why This Structure?

- **Dynamic Content**
  - The `contentPath` prop allows the component to fetch and render content dynamically, making it reusable for multiple pages.

- **BannerImage**
  - Displays a banner at the top of the page with a title, description, and image.
  - The `banner-wrapper` ensures the banner spans the full width of the viewport, even when constrained by parent containers.

- **Sidebar and Main Content**
  - The `v-col` structure ensures a responsive layout:
    - If `hasSidebarLinks` is `true`, the sidebar takes up 4 columns, and the main content takes up 8 columns.
    - If there are no sidebar links, the main content spans the full width (12 columns).

- **Flexibility**
  - The component is designed to handle different layouts (with or without a sidebar) and dynamically fetched content.

---

## 3. `BannerImage.vue`

### Purpose
`BannerImage.vue` is a reusable component for displaying a banner with a title, description, and image. It is used at the top of pages to provide context or branding.

### Current Implementation

```
<template>
  <div class="banner-image" :style="{ backgroundImage: `url(${image})` }">
    <div class="banner-content">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  image: String,
})
</script>

<style scoped>
.banner-image {
  width: 100%;
  height: 300px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-content {
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 8px;
}
</style>
```

#### Why This Structure?

- **Reusability**
  - The `BannerImage` component can be reused across multiple pages, reducing duplication.

- **Dynamic Props**
  - Accepts `title`, `description`, and `image` as props, making it flexible for different use cases.

- **Full-Width Design**
  - The `width: 100%` and `background-size: cover` ensure the banner spans the full width of its container and displays the image properly.

- **Accessibility**
  - The `h1` and `p` elements provide semantic structure for screen readers.

---

## Why This Approach?

- **Modularity**
  - Each component (`app.vue`, `ContentPage.vue`, `BannerImage.vue`) has a clear purpose and is reusable across the project.

- **Flexibility**
  - The use of props and dynamic layouts ensures that the components can adapt to different pages and content.

- **Consistency**
  - By centralizing the layout in `app.vue` and using reusable components like `ContentPage` and `BannerImage`, the project maintains a consistent look and feel.

- **Scalability**
  - This structure allows for easy addition of new pages and features without duplicating code.

---

## Future Considerations

- **Documentation**
  - Add comments to each component explaining its purpose and how to use it.
  - Document the props and expected behavior of reusable components like `BannerImage`.

- **Testing**
  - Write unit tests for `ContentPage` and `BannerImage` to ensure they behave as expected with different props and layouts.

- **Performance**
  - Optimize the `BannerImage` component to lazy-load images for better performance on slower networks.

- **Styling**
  - Consider centralizing shared styles (e.g., `banner-wrapper`) in a global SCSS file for easier maintenance.

---

This documentation should help future developers understand the reasoning behind the current structure and make informed decisions when extending or modifying the project.
