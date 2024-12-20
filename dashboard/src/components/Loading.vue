<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
</script>

<template>
  <div id="Loading">
    <Icon class="loading-icon" icon="mingcute:loading-3-fill" />
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
