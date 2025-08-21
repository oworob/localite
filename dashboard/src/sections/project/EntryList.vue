<script setup lang="ts">
import { computed } from 'vue'
import { useProjectStore } from '@/stores/ProjectStore'
import LanguageSelect from '../../components/LanguageSelect.vue'

const ProjectStore = useProjectStore()

const entries_with_status = computed(() => {
  return ProjectStore.project!.entries!.map((entry) => {
    const status = entry.languages!.find(
      (language) => language.id === ProjectStore.selected_language!.id,
    )!.status
    return { ...entry, status }
  })
})
</script>

<template>
  <main id="EntryList">
    <header class="header">
      <h3>{{ ProjectStore.project!.title }}</h3>
    </header>

    <p>Language:</p>
    <LanguageSelect
      :languages="ProjectStore.project!.languages!"
      :selected="ProjectStore.selected_language!"
      @languageSelected="ProjectStore.SetSelectedLanguage($event)"
    />

    <div class="entries">
      <p>Entries:</p>

      <div
        v-for="entry in entries_with_status"
        :key="entry.id"
        class="entry panel hover"
        @click="ProjectStore.SetSelectedEntry(entry.id)"
        :class="{ selected: entry.id === ProjectStore.selected_entry!.id }"
      >
        <span class="status-dot" :class="entry.status"></span>
        <p class="content">{{ entry.content }}</p>
        <!-- <div class="info hint">
          <p v-if="entry.status === 'needs_translation'">Needs translation!</p>
          <p v-else-if="entry.status === 'accepted'">Accepted.</p>
          <p v-else-if="entry.status === 'pending'">
            Pending ({{
              entry.languages!.find(
                (language) => language.id === ProjectStore.selectedw_language!.id,
              )!.translation_count
            }})
          </p>
        </div> -->
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
#EntryList {
  align-self: start;
  position: sticky;
  top: var(--topbar-height);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.entries {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
  max-height: 50vh; // adjust this
  // padding-right: 5px; // add this only when scrollable

  .entry {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    .content {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .status-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      aspect-ratio: 1 / 1;
      background: var(--text);
      &.needs_translation {
        background: var(--error);
      }
      &.accepted {
        background: var(--success);
      }
      &.pending {
        background: var(--warn);
      }
    }
    &.selected {
      border-color: var(--theme);
    }
  }
}
</style>
