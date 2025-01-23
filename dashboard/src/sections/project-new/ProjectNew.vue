<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { UNKNOWN_ERROR } from '@/assets/errors'
import { ICONS } from '@/assets/icons'
import LanguageMultiSelect from '@/components/LanguageMultiSelect.vue'
import LanguageSelect from '@/components/LanguageSelect.vue'
import Loading from '@/components/Loading.vue'
import UserMultiSelect from '@/components/UserMultiSelect.vue'
import type { INewEntry } from '@/models/project/entry'
import type IApiLanguage from '@/models/project/language'
import type { INewProject } from '@/models/project/project'
import { type IApiUser, UserStatus } from '@/models/user/user'
import LanguageService from '@/services/LanguageService'
import ProjectService from '@/services/ProjectService'
import { useNotificationStore } from '@/stores/NotificationStore'
import ImportEntries from './ImportEntries.vue'

const loading = ref(true) // load languages
const form_step = ref(1)
const submitting = ref(false)
const title = ref('')
const description = ref('')
const notes = ref<string[]>([])
const notes_collapsed = ref(false)
const languages = ref<IApiLanguage[]>([])
const selected_original_language = ref<IApiLanguage>()
const selected_desired_languages = ref<IApiLanguage[]>([])
const selected_users = ref<IApiUser[]>([])
const entries = ref<INewEntry[]>([{ content: '', context: '' }])
const entries_collapsed = ref(false)
const import_window_open = ref(false)

const NotificationStore = useNotificationStore()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  LanguageService.GetLanguages().then((res) => {
    languages.value = res.data
    selected_original_language.value = languages.value[0]
    loading.value = false
  })
})

async function Submit() {
  submitting.value = true
  const new_project: INewProject = {
    title: title.value,
    description: description.value,
    notes: notes.value,
    original_language_id: selected_original_language.value!.id,
    languages: selected_desired_languages.value.map((language) => language.id),
    contributors: selected_users.value.map((user) => user.id),
    entries: entries.value,
  }
  try {
    const res = await ProjectService.CreateProject(new_project)
    router.push({ path: '/projects/' + res.data })
    NotificationStore.AddNotification('Project created successfully.', 'success')
  } catch (err: any) {
    if (err.response.data.message) {
      NotificationStore.AddNotification(err.response.data.message, 'error')
      if (err.response.data.step) {
        UpdateFormStep(err.response.data.step)
      }
    } else {
      NotificationStore.AddNotification(UNKNOWN_ERROR, 'error')
    }
    submitting.value = false
  }
}

function AddNewNote() {
  if (notes.value.length < 5) {
    notes.value.push('')
    notes_collapsed.value = false
  }
}

function DeleteNote(index: number) {
  notes.value.splice(index, 1)
}

function AddNewEntry() {
  if (entries.value.length < 1000) {
    entries.value.push({ content: '', context: '' })
    entries_collapsed.value = false
  }
}

function DeleteEntry(index: number) {
  entries.value.splice(index, 1)
}

function HandleOriginalLanguageSelected(id: number) {
  selected_original_language.value = languages.value.find((language) => language.id === id)!
  selected_desired_languages.value = selected_desired_languages.value.filter(
    (language) => language.id !== id,
  )
}

function HandleDesiredLanguageSelected(id: number) {
  const language = languages.value.find((language) => language.id === id)!
  if (
    !selected_desired_languages.value.find(
      (selected_language) => selected_language.id === language.id,
    )
  ) {
    selected_desired_languages.value.push(language)
  } else {
    selected_desired_languages.value.splice(selected_desired_languages.value.indexOf(language), 1)
  }
}

function HandleUserSelected(user: IApiUser) {
  if (!selected_users.value.find((selected_user) => selected_user.id === user.id)) {
    selected_users.value.push(user)
  } else {
    selected_users.value.splice(selected_users.value.indexOf(user), 1)
  }
}

function SaveImportedEntries(new_entries: INewEntry[], mode: string) {
  if (mode === 'append') {
    entries.value = entries.value.concat(new_entries)
  } else {
    entries.value = new_entries
  }
  import_window_open.value = false
  entries_collapsed.value = false
}

function UpdateFormStep(step: number) {
  router.push(`new?step=${step}`)
}

watch(
  () => route.query.step,
  (newStep) => {
    if (newStep) {
      form_step.value = parseInt(newStep as string, 10)
    } else {
      form_step.value = 1
    }
  },
)
</script>

<template>
  <Loading v-if="loading" />

  <main class="ProjectNew" v-if="!loading">
    <header class="header">
      <h2>Create New Project</h2>
      <div class="steps">
        <span
          class="step"
          :class="{ active: form_step === index + 1 }"
          @click="UpdateFormStep(index + 1)"
          v-for="(step, index) in ['Details', 'Languages', 'Contributors', 'Entries']"
          :key="index"
        >
          <span class="step-number">{{ index + 1 }}</span>
          <p>{{ step }}</p>
          <div class="divider" v-if="index < 3"></div>
        </span>
      </div>
    </header>

    <form class="project-form" @submit.prevent="Submit">
      <div class="form-section" v-if="form_step === 1">
        <h4>Details</h4>
        <div class="form-item">
          <label class="hint">Title</label>
          <input type="text" v-model="title" placeholder="Your project's title" />
        </div>
        <div class="form-item">
          <label class="hint">Description</label>
          <textarea
            v-model="description"
            placeholder="A brief description of your project"
            spellcheck="false"
          ></textarea>
        </div>
        <div class="form-item">
          <div class="notes-header">
            <h4>Notes</h4>
            <div class="right">
              <button class="primary with-icon" type="button" @click="AddNewNote">
                <Icon :icon="ICONS.add" />New Note
              </button>
              <button
                class="tertiary icon"
                type="button"
                @click="notes_collapsed = !notes_collapsed"
              >
                <Icon :icon="ICONS.arrow_down" :rotate="notes_collapsed ? 0 : 2" />
              </button>
            </div>
          </div>
          <div class="notes" v-if="!notes_collapsed">
            <div v-if="notes.length === 0" class="hint">
              Add some notes to guide your contributors! For example: "Please remember about
              punctuation!".
            </div>
            <div class="note" v-for="(_, index) in notes" :key="index">
              <p class="hint">{{ index + 1 }}.</p>
              <input
                type="text"
                v-model="notes[index]"
                spellcheck="false"
                placeholder="An empty note"
              />
              <button type="button" class="tertiary icon" @click="DeleteNote(index)">
                <Icon :icon="ICONS.delete" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-section languages-section" v-if="form_step === 2">
        <div class="form-item">
          <h4>Original Language</h4>
          <p class="hint">
            The language in which the original text is written. This will be the base for all
            translations.
          </p>
          <LanguageSelect
            :languages="languages"
            :selected_language="selected_original_language!"
            @language-selected="HandleOriginalLanguageSelected"
          />
        </div>

        <div class="form-item">
          <h4>Desired Languages</h4>
          <p class="hint">The languages you would like your project to be translated into.</p>
          <LanguageMultiSelect
            :languages="
              languages.filter((language) => language.id !== selected_original_language?.id)
            "
            :selected_languages="selected_desired_languages"
            @language-selected="HandleDesiredLanguageSelected"
          />

          <div class="selected-languages">
            <div class="lang" v-for="language in selected_desired_languages" :key="language.id">
              <div class="lang-info panel">
                <Icon :icon="'circle-flags:' + language.code" />
                <span>{{ language.title_eng }} ({{ language.title_native }})</span>
              </div>
              <button
                type="button"
                class="tertiary icon"
                @click="
                  selected_desired_languages.splice(selected_desired_languages.indexOf(language), 1)
                "
              >
                <Icon :icon="ICONS.delete" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-section contributors-section" v-if="form_step === 3">
        <h4>Contributors</h4>
        <p class="hint">
          Select users you would like to translate your entries. Invites will be sent when the
          project is created.
        </p>
        <UserMultiSelect
          :selected_users="selected_users"
          @userSelected="HandleUserSelected"
          ignore_self
        />

        <div class="selected-users">
          <div class="user" v-for="user in selected_users" :key="user.id">
            <div class="user-info panel">
              <RouterLink :to="'/users/' + user.id">
                <p>{{ user.username }}</p>
              </RouterLink>

              <div class="user-stats hint">
                <p class="stat">
                  <Icon :icon="ICONS.project" />
                  {{ user.stats?.joined_projects }}
                </p>
                <p class="stat">
                  <Icon :icon="ICONS.translation" />
                  {{ user.stats?.translations }}
                </p>
                <p class="stat">
                  <Icon :icon="ICONS.user" />
                  {{ UserStatus[user.status] }}
                </p>
              </div>
            </div>
            <button
              type="button"
              class="tertiary icon"
              @click="selected_users.splice(selected_users.indexOf(user), 1)"
            >
              <Icon :icon="ICONS.delete" />
            </button>
          </div>
        </div>
      </div>

      <div class="form-section entry-section" v-if="form_step === 4">
        <div class="form-item">
          <header class="entry-header">
            <h3>Entries</h3>
            <div class="entry-actions">
              <button type="button" class="primary with-icon" @click="AddNewEntry">
                <Icon :icon="ICONS.add" />New Entry
              </button>
              <button type="button" class="secondary with-icon" @click="import_window_open = true">
                <Icon :icon="ICONS.upload" />Import from CSV
              </button>
              <button
                class="tertiary icon"
                type="button"
                @click="entries_collapsed = !entries_collapsed"
              >
                <Icon :icon="ICONS.arrow_down" :rotate="entries_collapsed ? 0 : 2" />
              </button>
            </div>
          </header>
          <p class="hint">Add entries to be translated. Each entry should be unique.</p>

          <div class="entries" v-if="!entries_collapsed">
            <div class="entry" v-for="(_, index) in entries" :key="index">
              <p class="hint">{{ index + 1 }}.</p>
              <input
                class="entry-content"
                type="text"
                v-model="entries[index].content"
                spellcheck="false"
                placeholder="An empty entry"
              />
              <input
                class="entry-context"
                type="text"
                v-model="entries[index].context"
                placeholder="Optional context"
                spellcheck="false"
              />
              <button
                type="button"
                class="tertiary icon"
                @click="DeleteEntry(index)"
                :disabled="entries.length === 1"
              >
                <Icon :icon="ICONS.delete" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button
          class="secondary with-icon"
          type="button"
          :disabled="form_step === 1"
          @click="UpdateFormStep(form_step - 1)"
        >
          <Icon :icon="ICONS.arrow_left" />Previous Step
        </button>
        <div class="right">
          <button
            class="primary with-icon"
            type="button"
            :disabled="form_step === 4"
            @click="UpdateFormStep(form_step + 1)"
          >
            Next Step
            <Icon :icon="ICONS.arrow_left" :rotate="2" />
          </button>
          <button
            class="primary with-icon submit-button"
            :disabled="submitting || !title || selected_desired_languages.length === 0"
          >
            <Icon :icon="ICONS.add" />Create New Project
          </button>
        </div>
      </div>
    </form>
  </main>
  <ImportEntries
    v-if="import_window_open"
    @close="import_window_open = false"
    @save-entries="SaveImportedEntries"
  />
</template>

<style scoped lang="scss">
.ProjectNew {
  padding: 0.5rem;
  .header {
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: var(--topbar-height);
    background: var(--background);
    .steps {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      .step {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        transition: var(--transition);
        color: var(--text-disabled);
        &:hover .step-number {
          border-color: var(--text);
          color: var(--text);
        }
        .step-number {
          padding: 0.5rem;
          border: solid 1px var(--text-disabled);
          border-radius: 50%;
          width: 1rem;
          height: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: var(--transition);
        }
        .divider {
          height: 2px;
          width: 2rem;
          background: var(--text-disabled);
        }
        &.active {
          color: var(--text);
          .step-number {
            background: var(--theme);
            border-color: var(--text);
            color: var(--text);
          }
        }
      }
    }
  }
}

.project-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem 6rem;
  .form-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .form-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      textarea {
        min-height: 5rem;
      }
    }
  }
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .right {
    display: flex;
    gap: 0.5rem;
  }
}

.notes {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  .note {
    input {
      flex-grow: 1;
    }
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.languages-section {
  display: grid !important;
  grid-template-columns: 1fr 1fr;
  flex-direction: row;
}

.contributors-section {
  display: grid !important;
  grid-template-columns: 1fr 1fr;
  h4,
  p {
    grid-column: span 2;
  }
}

.selected-languages,
.selected-users {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  .lang,
  .user {
    display: flex;
    gap: 0.5rem;
    .lang-info,
    .user-info {
      flex-grow: 1;
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .user-info {
      justify-content: space-between;
    }
    .user-stats {
      display: flex;
      gap: 1rem;
      .stat {
        display: flex;
        gap: 0.25rem;
        align-items: center;
        svg {
          color: var(--theme);
        }
      }
    }
    a {
      color: var(--text);
      text-decoration: none;
      transition: var(--transition);
      &:hover {
        color: var(--theme);
      }
    }
  }
}

.entry-section {
  grid-column: span 3;
  .entry-header {
    display: flex;
    justify-content: space-between;
  }
  .entry-actions {
    display: flex;
    gap: 0.5rem;
  }
  .entries {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    .entry {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      .entry-content {
        flex-grow: 0.75;
      }
      .entry-context {
        flex-grow: 0.25;
      }
    }
  }
}

.actions {
  position: fixed;
  display: flex;
  justify-content: space-between;
  width: calc(100% - 2rem);
  left: 0;
  bottom: 0;
  padding: 0.5rem 1rem;
  background: var(--background);
  .right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}
</style>
