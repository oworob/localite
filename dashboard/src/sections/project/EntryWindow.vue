<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, ref, watch } from 'vue'
import type { IApiEntry } from '@/models/project/entry'
import type IApiLanguage from '@/models/project/language'
import type { IApiProject } from '@/models/project/project'

const props = defineProps<{
  project: IApiProject
  selected_entry: IApiEntry
  selected_language: IApiLanguage
}>()

const translation_content = ref('')
const char_count = computed(() => translation_content.value.length)
const show_notes = ref(true)
const filtered_translations = computed(() =>
  props.selected_entry.translations?.filter(
    (translation) => translation.language_id === props.selected_language.id,
  ),
)

const punctuation_match = computed(() => {
  const original = props.selected_entry.content
  const translation = translation_content.value
  return original.match(/[.,!?]/g)?.length === translation.match(/[.,!?]/g)?.length
})

watch(
  () => props.selected_entry.id,
  () => {
    translation_content.value = ''
  },
)

// onMounted(() => {
//   const project_settings = PersistenceService.GetProjectSettings(props.project.id)
//   if (project_settings) {
//     show_notes.value = project_settings.show_notes ? project_settings.show_notes : true
//   }
// })
</script>

<template>
  <main id="EntryWindow">
    <header>
      <h3>Add {{ selected_language.title_eng }} Translation</h3>
    </header>

    <div class="notes panel">
      <div class="notes-header">
        <p class="hint">Notes from the owner</p>
        <button class="tertiary with-icon" @click="show_notes = !show_notes">
          <Icon icon="solar:alt-arrow-up-bold" :class="{ rotated: show_notes }" />
          {{ show_notes ? 'Hide' : 'Show' }}
        </button>
      </div>
      <ol v-if="show_notes">
        <li v-for="note in project.notes" :key="note.id" class="hint">{{ note.content }}</li>
      </ol>
    </div>

    <div class="original panel">
      <p class="hint">{{ project.original_language?.title_native }}:</p>
      <p class="content">{{ selected_entry.content }}</p>
    </div>

    <p class="hint">Enter your {{ selected_language.title_eng }} translation below:</p>

    <div class="translation">
      <textarea
        :maxlength="selected_entry.content.length! * 2"
        :placeholder="selected_entry.content"
        v-model="translation_content"
        autofocus
        spellcheck="false"
      ></textarea>
      <footer class="below">
        <p
          class="counter hint"
          :class="{
            warn: char_count > selected_entry.content.length!,
          }"
        >
          {{ char_count }} / {{ selected_entry.content.length }}
        </p>
        <button class="primary with-icon" :disabled="translation_content.length === 0">
          <Icon icon="solar:add-circle-bold" />
          Submit
        </button>
      </footer>
    </div>

    <ul class="warnings" v-if="char_count > 0">
      <li v-if="char_count > selected_entry.content.length!" class="hint warn">
        Translation length should not exceed the original length as it may cause layout issues.
      </li>
      <li v-if="!punctuation_match" class="hint warn">
        Punctuation should match the original text.
      </li>
    </ul>

    <div class="submitted">
      <h4>Submitted {{ selected_language.title_eng }} Translations</h4>
      <div class="translations">
        <p v-if="filtered_translations?.length === 0" class="hint">
          No translations have been submitted yet.
        </p>
        <div
          v-else
          v-for="translation in filtered_translations"
          :key="translation.id"
          class="translation panel"
        >
          <div class="data">
            <p>{{ translation.content }}</p>
            <p class="hint">Submitted by: {{ translation.author?.username }}</p>
          </div>
          <div class="upvotes">
            <button class="secondary">
              <Icon icon="solar:alt-arrow-up-bold" />
            </button>
            <p>{{ (translation.total_votes > 0 ? '+' : '') + translation.total_votes }}</p>
            <button class="secondary">
              <Icon icon="solar:alt-arrow-down-bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
#EntryWindow {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notes {
  button {
    padding: 0;
  }
  .notes-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  svg.rotated {
    transform: rotate(180deg);
  }
}

.original {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  .content {
    font-size: 120%;
  }
}

.translation {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .below {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    .counter {
      white-space: nowrap;
      transition: var(--transition);
      &.warn {
        color: var(--warn);
      }
    }
  }
}

.warnings {
  .warn {
    color: var(--warn);
  }
}

.submitted {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .translations {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    .translation {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .upvotes {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.3rem;
        button {
          padding: 5px 10px;
          display: flex;
        }
      }
    }
  }
}
</style>
