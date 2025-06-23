<template>
  <div class="d-inline-block" style="position: relative;">
    <!-- Balloon -->
    <v-sheet
      class="pa-4 elevation-2"
      :style="{
        backgroundColor: `var(--${props.color || 'indigo-light'})`,
        color: 'white',
        border: `1px solid var(--${props.color || 'indigo-light'})`,
        borderRadius: '8px', // Make it more square
        minWidth: '120px',
        minHeight: '60px',
        boxSizing: 'border-box',
      }"
    >
      <slot />
    </v-sheet>

    <!-- Comic-style speech arrow -->
    <div
      :style="{
        position: 'absolute',
        bottom: '-18px',
        left: '30px',
        width: 0,
        height: 0,
        borderLeft: '16px solid transparent',
        borderRight: '16px solid transparent',
        borderTop: `18px solid var(--${props.color || 'indigo'})`,
        filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.08))',
      }"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  color?: 'indigo' | 'skyBlue' | 'rajah' | 'warning' | 'error' | 'success' | 'logo-color'
}>()
</script>
