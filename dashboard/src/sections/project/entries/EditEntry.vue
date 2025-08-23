<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'
import { ICONS } from '@/assets/icons'
import type { IApiEntry } from '@/models/project/entry'

const emit = defineEmits(['close', 'saveEntry'])

const component = ref(null)
onClickOutside(component, (event) => {
  emit('close')
})

const props = defineProps<{
  entry: IApiEntry
}>()

function SaveEntry() {
  emit('saveEntry')
}

const entry_form = ref({})
</script>

<template>
  <main id="EditEntry" class="modal">
    <div class="content panel" ref="component">
      <header class="header">
        <h3>Edit Entry</h3>
      </header>

      <form class="entry-form">
        <div class="form-item">
          <label>Content</label>
          <p>{{ entry }}</p>
          <!-- <input type="text" v-model="entry.content" /> -->
        </div>
        <div class="form-item">
          <label>Context</label>
          <!-- <input type="text" /> -->
        </div>
      </form>

      <div class="actions">
        <button class="cancel tertiary" @click="emit('close')">Cancel</button>
        <button class="submit primary with-icon" @click="SaveEntry">
          <Icon :icon="ICONS.save" />
          Save
        </button>
      </div>
    </div>
  </main>
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

.entry-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .form-item {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
}
</style>
