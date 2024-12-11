<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
</script>

<template>
  <div id="Loading">
    <Icon class="icon" icon="mingcute:loading-3-fill" />
  </div>
</template>

<style scoped lang="scss">
#Loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10% 0;
  .icon {
    color: var(--theme);
    font-size: 5rem;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
