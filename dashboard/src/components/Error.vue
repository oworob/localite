<script setup lang="ts">
import type { IApiError } from '@/models/system/api-error'
import { Icon } from '@iconify/vue/dist/iconify.js'

const props = defineProps<{
  error: IApiError
}>()
</script>

<template>
  <div id="Error">
    <Icon class="icon" icon="solar:sad-circle-bold" />
    <h4>{{ error.message }}</h4>
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
