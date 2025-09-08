<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ICONS } from '@/assets/icons'
import Error from '@/components/Error.vue'
import LanguageSelect from '@/components/LanguageSelect.vue'
import Loading from '@/components/Loading.vue'
import { type IApiEntry } from '@/models/project/entry'
import { type IApiTranslation, type INewTranslation } from '@/models/project/translation'
import EntryService from '@/services/EntryService'
import TranslationService from '@/services/TranslationService'
import { useAuthStore } from '@/stores/AuthStore'
import { useConfirmStore } from '@/stores/ConfirmStore'
import { useNotificationStore } from '@/stores/NotificationStore'
import { useProjectStore } from '@/stores/ProjectStore'
import { FormatDate } from '@/tools/FormatDate'
import EntryFilterSelect from './EntryFilterSelect.vue'

const ProjectStore = useProjectStore()
const AuthStore = useAuthStore()
const NotificationStore = useNotificationStore()
const ConfirmStore = useConfirmStore()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const loading_translations = ref(true)
const error = ref('')
const submitting = ref(false)
const entries = ref<IApiEntry[]>([])
const translations = ref<IApiTranslation[]>([])
const new_translation = ref('')
const show_context = ref(false)
const show_translations = ref(true)

const entry_filters = [
  { label: 'Everything', value: 'everything', fun: () => true },
  {
    label: 'Needs Translation',
    value: 'needs_translation',
    fun: (entry: IApiEntry) => entry.status === 'needs_translation',
  },
  { label: 'Pending', value: 'pending', fun: (entry: IApiEntry) => entry.status === 'pending' },
  { label: 'Approved', value: 'approved', fun: (entry: IApiEntry) => entry.status === 'approved' },
]
const selected_entry_filter = ref('everything')
const search_query = ref('')

const selected_language = computed(() => {
  const id = Number(route.query.lang_id)
  return (
    ProjectStore.project!.languages!.find((language) => language.id === id) ||
    ProjectStore.project!.languages![0]
  )
})

const filtered_entries = computed(() => {
  const fun = entry_filters.find((f) => f.value === selected_entry_filter.value)!.fun
  const filtered =
    entries.value.filter((entry) => {
      const matches_search = entry.content.toLowerCase().includes(search_query.value.toLowerCase())
      return matches_search && fun(entry)
    }) || []
  return filtered.sort((a, b) => a.content.localeCompare(b.content))
})

const selected_entry = computed(() => {
  const id = Number(route.query.entry_id)
  return entries.value.find((entry) => entry.id === id) || filtered_entries.value[0]
})

const sorted_translations = computed(() => {
  if (!translations.value) return []
  return [...translations.value].sort((a, b) => {
    // 1. approved
    if (a.approved && !b.approved) return -1
    if (!a.approved && b.approved) return 1
    // 2. rating
    if (b.rating !== a.rating) return b.rating - a.rating
    // 3. date
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
})

watch(selected_language, () => {
  FetchEntries()
})

watch(selected_entry, () => {
  FetchTranslations()
})

async function SetSelectedLanguage(lang_id: number) {
  router.replace({ query: { ...route.query, lang_id: lang_id.toString() } })
}

function SetSelectedEntry(entry_id: number) {
  router.replace({ query: { ...route.query, entry_id: entry_id.toString() } })
  new_translation.value = ''
}

function UpdateEntryStatus() {
  const found_approved = translations.value.find((t) => t.approved)
  if (found_approved) {
    selected_entry.value!.status = 'approved'
  } else if (translations.value.length > 0) {
    selected_entry.value!.status = 'pending'
  } else {
    selected_entry.value!.status = 'needs_translation'
  }
}

async function SubmitTranslation() {
  const data: INewTranslation = {
    project_id: ProjectStore.project!.id,
    entry_id: selected_entry.value!.id,
    language_id: selected_language.value!.id,
    content: new_translation.value,
  }
  submitting.value = true
  try {
    const res = await TranslationService.CreateTranslation(data)
    new_translation.value = ''
    translations.value.push(res.data)
    UpdateEntryStatus()
  } catch (err: any) {
    if (err.response?.data.message) {
      NotificationStore.AddNotification(err.response.data.message, 'error')
    } else {
      NotificationStore.AddNotification(err.message, 'error')
    }
  } finally {
    submitting.value = false
  }
}

async function DeleteTranslation(translation_id: number) {
  const translation = translations.value.find((t) => t.id === translation_id)
  const confirmed = await ConfirmStore.Open(
    'Delete Translation?',
    `Are you sure you want to delete ${translation?.approved ? 'the approved translation' : 'this translation'}? This action cannot be undone.`,
    'Delete',
    'Cancel',
    true,
  )
  if (!confirmed) return
  try {
    await TranslationService.DeleteTranslation(translation_id)
    translations.value = translations.value.filter((t) => t.id !== translation_id)
    UpdateEntryStatus()
  } catch (err: any) {
    if (err.response?.data.message) {
      NotificationStore.AddNotification(err.response.data.message, 'error')
    } else {
      NotificationStore.AddNotification(err.message, 'error')
    }
  }
}

async function FetchEntries() {
  try {
    loading.value = true
    const res = await EntryService.GetProjectEntries(
      ProjectStore.project!.id,
      selected_language.value!.id,
    )
    entries.value = res.data
  } catch (err: any) {
    if (err.response?.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = err.message
    }
  } finally {
    loading.value = false
  }
}

async function FetchTranslations() {
  try {
    loading_translations.value = true
    const res = await TranslationService.GetEntryTranslations(
      selected_entry.value?.id,
      selected_language.value!.id,
      ['author', 'votes'],
    )
    translations.value = res.data
  } catch (err: any) {
    if (err.response?.data.message) {
      NotificationStore.AddNotification(err.response.data.message, 'error')
    } else {
      NotificationStore.AddNotification(err.message, 'error')
    }
  } finally {
    loading_translations.value = false
  }
}

async function RequestContext() {
  try {
    await EntryService.RequestContext(selected_entry.value!.id)
    selected_entry.value!.context_requested = true
  } catch (err: any) {
    if (err.response?.data.message) {
      NotificationStore.AddNotification(err.response.data.message, 'error')
    } else {
      NotificationStore.AddNotification(err.message, 'error')
    }
  }
}

async function Vote(translation_id: number, new_vote: -1 | 0 | 1) {
  const translation = translations.value!.find((t) => t.id === translation_id)!
  translation.rating += new_vote - translation.user_vote
  translation.user_vote = new_vote
  try {
    await TranslationService.VoteForTranslation(translation_id, new_vote)
  } catch (err: any) {
    if (err.response?.data.message) {
      NotificationStore.AddNotification(err.response.data.message, 'error')
    } else {
      NotificationStore.AddNotification(err.message, 'error')
    }
  }
}

async function ApproveTranslation(translation_id: number) {
  try {
    await TranslationService.ApproveTranslation(translation_id)
    const approved_exists = translations.value.find((t) => t.approved)
    if (approved_exists) {
      approved_exists.approved = false
    }
    translations.value.find((t) => t.id === translation_id)!.approved = true
    UpdateEntryStatus()
  } catch (err: any) {
    if (err.response?.data.message) {
      NotificationStore.AddNotification(err.response.data.message, 'error')
    } else {
      NotificationStore.AddNotification(err.message, 'error')
    }
  }
}

// onMounted(() => {
//   console.log(route.query)
//   // if (!route.query.lang_id) {
//   // SetSelectedLanguage(ProjectStore.project!.languages![0].id)
//   // SetSelectedLanguage(ProjectStore.project!.languages![1].id)
//   router.replace({ query: { ...route.query, lang_id: ProjectStore.project!.languages![1].id } })
//   // }
//   // SetSelectedLanguage(ProjectStore.project!.languages![0].id)
//   // SetSelectedLanguage(ProjectStore.project!.languages![1].id)
//   // if (!route.query.entry_id) {
//   //   console.log(filtered_entries.value)
//   //   SetSelectedEntry(filtered_entries.value[0].id)
//   // }
// })

onMounted(() => {
  FetchEntries()
})
</script>

<template>
  <Loading v-if="loading" />
  <Error v-if="error" :error="error" />

  <main id="ProjectTranslationsView" v-if="!loading && !error && ProjectStore.project">
    <nav class="entry-list">
      <p>Language:</p>
      <LanguageSelect
        :languages="ProjectStore.project.languages!"
        :selected="selected_language"
        @languageSelected="SetSelectedLanguage($event)"
      />

      <p>Filters:</p>
      <div class="filters">
        <EntryFilterSelect
          :options="entry_filters"
          :selected="selected_entry_filter"
          @filterSelected="selected_entry_filter = $event"
        />
        <input type="text" class="input" placeholder="Search entries" v-model="search_query" />
      </div>

      <p>Entries:</p>
      <div class="entries">
        <p class="hint" v-if="filtered_entries.length === 0">No matching entries found.</p>
        <button
          v-for="entry in filtered_entries"
          :key="entry.id"
          class="entry panel hover"
          @click="SetSelectedEntry(entry.id)"
          :class="{ selected: entry.id === selected_entry.id }"
        >
          <span class="status-dot" :class="entry.status"></span>
          <p class="content">{{ entry.content }}</p>
        </button>
      </div>
    </nav>

    <section class="entry-window">
      <header class="header">
        <h4>{{ ProjectStore.project.source_language!.title_eng }} Entry To Translate:</h4>
        <button
          class="secondary"
          v-if="selected_entry.context"
          @click="show_context = !show_context"
        >
          {{ show_context ? 'Hide Context' : 'Show Context' }}
        </button>
        <button
          class="secondary"
          v-else
          :disabled="selected_entry.context_requested"
          @click="RequestContext"
        >
          {{ selected_entry.context_requested ? 'Context Requested' : 'Request Context' }}
        </button>
      </header>

      <div class="source panel">
        <p class="content">{{ selected_entry.content }}</p>
        <div class="context hint" v-if="show_context">Context: {{ selected_entry.context }}</div>
      </div>

      <p class="hint">Enter your {{ selected_language.title_eng }} translation below:</p>

      <div class="translation">
        <textarea
          :maxlength="selected_entry.content.length! * 2"
          :placeholder="selected_entry.content"
          v-model="new_translation"
          autofocus
          spellcheck="false"
        ></textarea>
        <footer class="below">
          <p
            class="counter hint"
            :class="{
              warn: new_translation.length > selected_entry.content.length!,
            }"
          >
            {{ new_translation.length }} / {{ selected_entry.content.length }}
          </p>
          <button
            class="primary with-icon"
            :disabled="new_translation.length === 0 || submitting"
            @click="SubmitTranslation"
          >
            <Icon :icon="ICONS.add" />
            Submit Translation
          </button>
        </footer>
      </div>

      <div class="submitted">
        <header class="header">
          <h4>Submitted {{ selected_language.title_eng }} Translations</h4>
          <button
            class="secondary icon"
            type="button"
            @click="show_translations = !show_translations"
          >
            <Icon :icon="ICONS.arrow_down" :rotate="show_translations ? 0 : 2" />
          </button>
        </header>

        <Loading v-if="loading_translations" />
        <div class="translations" v-else-if="show_translations">
          <p v-if="translations.length === 0" class="hint">
            No translations have been submitted yet.
          </p>

          <div
            v-for="translation in sorted_translations"
            :key="translation.id"
            class="translation panel"
            :class="{ approved: translation.approved }"
          >
            <div class="data">
              <div class="content">
                <Icon :icon="ICONS.check" class="icon" v-if="translation.approved" />
                <span>{{ translation.content }}</span>
              </div>
              <div class="actions">
                <button
                  class="icon upvote"
                  :class="translation.user_vote === 1 ? 'primary' : 'secondary'"
                  @click="Vote(translation.id, translation.user_vote === 1 ? 0 : 1)"
                >
                  <Icon :icon="ICONS.plus" :rotate="2" />
                </button>
                <button
                  class="icon downvote"
                  :class="translation.user_vote === -1 ? 'primary' : 'secondary'"
                  @click="Vote(translation.id, translation.user_vote === -1 ? 0 : -1)"
                >
                  <Icon :icon="ICONS.minus" />
                </button>
                <button
                  v-if="ProjectStore.IsProjectOwner()"
                  class="secondary with-icon"
                  :disabled="translation.approved"
                  @click="ApproveTranslation(translation.id)"
                >
                  <Icon :icon="ICONS.check" />
                  {{ translation.approved ? 'Approved' : 'Approve' }}
                </button>
                <button
                  class="icon secondary danger"
                  v-if="
                    ProjectStore.IsProjectOwner() || translation.author!.id === AuthStore.user!.id
                  "
                  @click="DeleteTranslation(translation.id)"
                >
                  <Icon :icon="ICONS.delete"></Icon>
                </button>
              </div>
            </div>
            <div class="details hint">
              <span>By {{ translation.author!.username }}</span>
              <span>{{ FormatDate(translation.created_at, true) }}</span>
              <span :class="{ danger: translation.rating < 0 }"
                >Rating: {{ translation.rating }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
#ProjectTranslationsView {
  display: grid;
  grid-template-columns: 25% 75%;
}

.entry-list {
  align-self: start;
  position: sticky;
  top: var(--topbar-height);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .filters {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .entries {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    overflow-y: auto;
    // max-height: 50vh; // adjust this
    padding-right: 5px;

    .entry {
      width: 100%;
      font-size: inherit;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      .content {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .status-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        aspect-ratio: 1 / 1;
        background: var(--text);
        &.needs_translation {
          background: var(--error);
        }
        &.approved {
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
}

.entry-window {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .source {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .translation {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    textarea {
      height: 6rem;
    }

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
    gap: 0.5rem;
    .translations {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      .translation {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        .data {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            .icon {
              color: var(--success);
            }
          }
          .actions {
            display: flex;
            gap: 0.3rem;
          }
        }
        .details {
          display: flex;
          gap: 0.5rem;
          :not(:last-child)::after {
            content: '•';
            color: var(--text);
            margin-left: 0.5rem;
          }
          .danger {
            color: var(--error);
          }
        }
        &.approved {
          border-color: var(--success);
          .data {
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
