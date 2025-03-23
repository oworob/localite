<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { ICONS } from '@/assets/icons'
const props = defineProps<{
  error: string
}>()
</script>

<template>
  <div id="Error">
    <Icon class="icon" :icon="ICONS.error" />
    <h4>{{ error || 'Unknown Error' }}</h4>
    <RouterLink to="/">
      <button class="secondary">Return Home</button>
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
#Error {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  padding: 10% 0;
  .icon {
    color: var(--theme);
    font-size: 5rem;
  }
}
</style>
