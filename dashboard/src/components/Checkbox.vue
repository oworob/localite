<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { ICONS } from '@/assets/icons'

const props = defineProps<{
  checked: boolean
}>()
</script>

<template>
  <div id="Checkbox" :class="{ checked: props.checked }">
    <Icon :icon="ICONS.check" />
  </div>
</template>

<style scoped lang="scss">
#Checkbox {
  display: flex;
  opacity: 0;
  transition: opacity var(--transition);
  &.checked {
    opacity: 1;
  }
}
</style>
