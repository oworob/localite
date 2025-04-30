<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'

const props = defineProps<{
  content: string
}>()

const emit = defineEmits(['confirm', 'close'])

const component = ref(null)
onClickOutside(component, (event) => {
  emit('close')
})
</script>

<template>
  <div id="Confirm" class="modal">
    <div class="content panel" ref="component">
      <header>
        <h3>Are you sure?</h3>
      </header>

      <p class="hint">{{ props.content }}</p>

      <div class="actions">
        <button class="close tertiary" @click="emit('close')">Cancel</button>
        <button class="confirm primary" @click="emit('confirm')">Confirm</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}

.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
