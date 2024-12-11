<script setup lang="ts">
import type { IApiEntry } from '@/models/project/entry'
import type { IApiProject } from '@/models/project/project'
import { Icon } from '@iconify/vue/dist/iconify.js'
import LanguageSelect from './LanguageSelect.vue'
import type IApiLanguage from '@/models/project/language'
import { computed } from 'vue'

const emit = defineEmits(['entrySelected', 'languageSelected'])
const props = defineProps<{
  project: IApiProject
  selected_entry: IApiEntry
  selected_language: IApiLanguage
}>()

const entries_with_status = computed(() => {
  return props.project!.entries!.map((entry) => {
    const status = entry.languages!.find(
      (language) => language.id === props.selected_language.id,
    )!.status
    return { ...entry, status }
  })
})

function SelectEntry(id: number) {
  emit('entrySelected', id)
}
</script>

<template>
  <main id="EntryList">
    <nav class="nav">
      <RouterLink to="/projects">
        <button class="tertiary with-icon back-button">
          <Icon icon="solar:alt-arrow-left-bold" />
          Back to Projects
        </button>
      </RouterLink>
    </nav>
    <header class="header">
      <h4>{{ project.title || 'Project' }}</h4>
      <p class="hint">The owner of the project has asked to translate the entries below.</p>
    </header>

    <LanguageSelect
      :languages="project.languages!"
      :selected_language="selected_language"
      @languageSelected="emit('languageSelected', $event)"
    />

    <div class="entries">
      <p>Entries:</p>
      <div
        v-for="entry in entries_with_status"
        :key="entry.id"
        class="entry panel hover"
        @click="SelectEntry(entry.id)"
        :class="{ selected: entry.id === selected_entry.id }"
      >
        <div class="title-wrapper">
          <p class="title">{{ entry.content }}</p>
          <span class="status-dot" :class="entry.status"> </span>
        </div>
        <div class="info hint">
          <p v-if="entry.status === 'needs_translation'">Needs translation!</p>
          <p v-else-if="entry.status === 'accepted'">Accepted.</p>
          <p v-else-if="entry.status === 'pending'">
            Pending ({{
              entry.languages?.find((language) => language.id === selected_language.id)
                ?.translation_count
            }})
          </p>
        </div>
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
  gap: 1rem;
}

.nav {
  .back-button {
    padding-left: 0;
  }
}

.entries {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  max-height: 50vh; // adjust this
  // padding-right: 5px; // add this only when scrollable

  .entry {
    cursor: pointer;
    background: var(--panel);
    border-radius: 5px;
    &.selected {
      border-color: var(--theme);
    }
    .title-wrapper {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      .title {
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
    }
  }
}
</style>
