<template>
  <div class="accordionGroup">
    <slot />
  </div>
</template>

<script setup lang="ts">
// This component is a simple wrapper and doesn't require any additional logic.
</script>

<style scoped>
.accordionGroup {
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
        0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
    border-radius: 4px;
}
</style>
