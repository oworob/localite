<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'
import { useConfirmStore } from '@/stores/ConfirmStore'

const ConfirmStore = useConfirmStore()

const component = ref(null)
onClickOutside(component, (event) => {
  ConfirmStore.Cancel()
})
</script>

<template>
  <div id="ConfirmModal" class="modal" v-if="ConfirmStore.modal_data.open">
    <div class="content panel" ref="component">
      <header>
        <h3 class="title">{{ ConfirmStore.modal_data.title }}</h3>
      </header>

      <p class="hint message">{{ ConfirmStore.modal_data.message }}</p>

      <div class="actions">
        <button class="close tertiary" @click="ConfirmStore.Cancel()">
          {{ ConfirmStore.modal_data.cancel_text }}
        </button>
        <button
          class="confirm primary"
          :class="{ danger: ConfirmStore.modal_data.danger }"
          @click="ConfirmStore.Confirm()"
        >
          {{ ConfirmStore.modal_data.confirm_text }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#ConfirmModal {
  z-index: 201;
}
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
  justify-content: space-between;
  gap: 1rem;
}
</style>
