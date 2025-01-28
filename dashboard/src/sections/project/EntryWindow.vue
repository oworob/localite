<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, ref, watch } from 'vue'
import { UNKNOWN_ERROR } from '@/assets/errors'
import { ICONS } from '@/assets/icons'
import type { INewTranslation } from '@/models/project/translation'
import TranslationService from '@/services/TranslationService'
import { useNotificationStore } from '@/stores/NotificationStore'
import { useProjectStore } from '@/stores/ProjectStore'

const ProjectStore = useProjectStore()

const translation_content = ref('')
const char_count = computed(() => translation_content.value.length)
const show_translations = ref(true)
const submitting = ref(false)
const NotificationStore = useNotificationStore()
const filtered_translations = computed(() =>
  ProjectStore.selected_entry!.translations!.filter(
    (translation) => translation.language_id === ProjectStore.selected_language!.id,
  ),
)

watch(
  () => ProjectStore.selected_entry!.id,
  () => {
    translation_content.value = ''
  },
)

async function SubmitTranslation() {
  submitting.value = true
  const new_translation: INewTranslation = {
    project_id: ProjectStore.project!.id,
    entry_id: ProjectStore.selected_entry!.id,
    language_id: ProjectStore.selected_language!.id,
    content: translation_content.value,
  }
  try {
    const res = await TranslationService.CreateTranslation(new_translation)
    NotificationStore.AddNotification('Translation added successfully.', 'success')
    // translation_content.value = ''
    filtered_translations.value!.push(res.data)
  } catch (err: any) {
    if (err.response.data.message) {
      NotificationStore.AddNotification(err.response.data.message, 'error')
    } else {
      NotificationStore.AddNotification(UNKNOWN_ERROR, 'error')
    }
    submitting.value = false
  }
}
</script>

<template>
  <main id="EntryWindow">
    <header>
      <h3>Add {{ ProjectStore.selected_language!.title_eng }} Translation</h3>
    </header>

    <div class="original panel">
      <p class="hint">{{ ProjectStore.project!.original_language!.title_native }}:</p>
      <p class="content">{{ ProjectStore.selected_entry!.content }}</p>
    </div>

    <p class="hint">
      Enter your {{ ProjectStore.selected_language!.title_eng }} translation below:
    </p>

    <div class="translation">
      <textarea
        :maxlength="ProjectStore.selected_entry!.content.length! * 2"
        :placeholder="ProjectStore.selected_entry!.content"
        v-model="translation_content"
        autofocus
        spellcheck="false"
      ></textarea>
      <footer class="below">
        <p
          class="counter hint"
          :class="{
            warn: char_count > ProjectStore.selected_entry!.content.length!,
          }"
        >
          {{ char_count }} / {{ ProjectStore.selected_entry!.content.length }}
        </p>
        <button
          class="primary with-icon"
          :disabled="translation_content.length === 0 || submitting"
          @click="SubmitTranslation"
        >
          <Icon :icon="ICONS.add" />
          Submit
        </button>
      </footer>
    </div>

    <div class="submitted">
      <header class="header">
        <h4>Submitted {{ ProjectStore.selected_language!.title_eng }} Translations</h4>
        <button class="tertiary icon" type="button" @click="show_translations = !show_translations">
          <Icon :icon="ICONS.arrow_down" :rotate="show_translations ? 0 : 2" />
        </button>
      </header>

      <div class="translations" v-if="show_translations">
        <p v-if="filtered_translations!.length === 0" class="hint">
          No translations have been submitted yet.
        </p>
        <div
          v-else
          v-for="translation in filtered_translations"
          :key="translation.id"
          class="translation panel"
        >
          <div class="data" @click="translation_content = translation.content">
            <p>{{ translation.content }}</p>
            <p class="hint">Submitted by: {{ translation.author!.username }}</p>
          </div>
          <div class="upvotes">
            <button class="secondary">
              <Icon :icon="ICONS.arrow_down" :rotate="2" />
            </button>
            <p>{{ (translation.total_votes > 0 ? '+' : '') + translation.total_votes }}</p>
            <button class="secondary">
              <Icon :icon="ICONS.arrow_down" />
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

.submitted {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .translations {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    .translation {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      transition: var(--transition);
      &:has(.data:hover) {
        border-color: var(--theme);
      }
      .data {
        flex-grow: 1;
        height: max-content;
        cursor: pointer;
      }
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
