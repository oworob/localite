<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { ICONS } from '@/assets/icons'

const props = defineProps<{ modelValue: string; placeholder?: string }>()
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div id="ClearableInput">
    <input
      type="text"
      class="input"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
    />
    <button class="icon delete-button" v-if="modelValue" @click="emit('update:modelValue', '')">
      <Icon :icon="ICONS.close" />
    </button>
  </div>
</template>

<style scoped lang="scss">
#ClearableInput {
  display: flex;
  align-items: center;
  padding: 0;
  position: relative;

  .input {
    width: fit-content;
    border: none;
    background: none;
    border-radius: 0;
    transition: none;
    flex: 1;
    width: 100%;
    padding-right: 2.5rem;
  }

  .delete-button {
    padding-right: 15px;
    position: absolute;
    right: 0;
    svg {
      color: var(--theme);
    }
  }
}
</style>
