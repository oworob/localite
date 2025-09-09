<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { ICONS } from '@/assets/icons'

const props = defineProps<{
  checked: boolean
}>()
</script>

<template>
  <div id="Switch" :class="{ checked: props.checked }">
    <button class="switch-wrapper">
      <Icon class="icon" :icon="ICONS.check" />
    </button>
  </div>
</template>

<style scoped lang="scss">
#Switch {
  cursor: pointer;
  .switch-wrapper {
    padding: 0;
    transition: var(--transition);
    background-color: var(--panel-border);
    border-radius: 1rem;
    display: flex;
    border: 1px solid var(--panel-border);
    .icon {
      transition: var(--transition);
      font-size: 1.5rem;
      width: 2.5rem;
      translate: -0.5rem;
    }
  }
  &.checked {
    .switch-wrapper {
      justify-content: flex-end;
      background-color: var(--theme);
      border-color: var(--theme);
      .icon {
        translate: 0.5rem;
      }
    }
  }
  &:hover {
    .switch-wrapper {
      border-color: var(--text);
    }
  }
}
</style>
