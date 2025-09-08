<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ICONS } from '@/assets/icons'
import type { IApiEntry } from '@/models/project/entry'
import { useConfirmStore } from '@/stores/ConfirmStore'
import { useNotificationStore } from '@/stores/NotificationStore'
import { useProjectStore } from '@/stores/ProjectStore'
import EditEntry from './EditEntry.vue'

const ProjectStore = useProjectStore()
const NotificationStore = useNotificationStore()
const ConfirmStore = useConfirmStore()
const router = useRouter()

const show_edit_entry_window = ref(false)
const edited_entry = ref<IApiEntry>()

const emit = defineEmits(['refreshProject'])

// function GetCompletionPercentage(entry: IApiEntry): number {
//   const submitted = 0
//   entry.languages?.forEach((lang) => {
//     if (lang.translation_count > 0) {
//       submitted++
//     }
//   })
//   return (submitted / entry.languages!.length) * 100
// }

function OpenEditEntry(entry: IApiEntry) {
  edited_entry.value = entry
  show_edit_entry_window.value = true
}
</script>

<template>
  <main id="ProjectEntriesView">
    <header class="header">
      <h3>Project Entries</h3>
      <div class="actions">
        <button class="primary with-icon">
          <Icon :icon="ICONS.add" />
          Add Entries
        </button>
        <button class="secondary with-icon">
          <Icon :icon="ICONS.download" />
          Export to CSV
        </button>
      </div>
    </header>

    <section class="entries">
      <div class="entry" v-for="(entry, i) in ProjectStore.project!.entries" :key="entry.id">
        <p class="count">{{ i + 1 }}.</p>
        <button class="main panel hover" :onclick="OpenEditEntry">
          <p>{{ entry.content }}</p>
          <!-- <span class="hint">{{ GetCompletionPercentage(entry) }}%</span> -->
        </button>
      </div>
    </section>
  </main>

  <EditEntry
    v-if="show_edit_entry_window && edited_entry"
    :entry="edited_entry"
    @close="show_edit_entry_window = false"
    @saveEntry="emit('refreshProject')"
  />
</template>

<style scoped lang="scss">
#ProjectEntriesView {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  .header {
    display: flex;
    justify-content: space-between;
    .actions {
      display: flex;
      gap: 0.5rem;
    }
  }
}

.entries {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  .entry {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    .count {
      font-weight: bold;
      color: var(--theme);
    }
    .main {
      flex-grow: 1;
      display: flex;
      justify-content: space-between;
      font-size: inherit;
    }
  }
}
</style>
