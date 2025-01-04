<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { ICONS } from '@/assets/icons'
</script>

<template>
  <div id="Loading">
    <Icon class="loading-icon" :icon="ICONS.loading" />
  </div>
</template>

<style scoped lang="scss">
#Loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10% 0;
  .loading-icon {
    font-size: 5rem;
  }
}
</style>
