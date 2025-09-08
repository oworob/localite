<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ICONS } from '@/assets/icons'
import Error from '@/components/Error.vue'
import LanguageSelect from '@/components/LanguageSelect.vue'
import Loading from '@/components/Loading.vue'
import UserMultiSelect from '@/components/UserMultiSelect.vue'
import type { INewEntry } from '@/models/project/entry'
import type { IApiLanguage } from '@/models/project/language'
import type { INewProject, INewProjectForm } from '@/models/project/project'
import { type IApiUser, UserStatus } from '@/models/user/user'
import LanguageService from '@/services/LanguageService'
import ProjectService from '@/services/ProjectService'
import { useNotificationStore } from '@/stores/NotificationStore'
import ImportEntries from './ImportEntries.vue'

const NotificationStore = useNotificationStore()
const Router = useRouter()

const loading = ref(true)
const error = ref('')
const submitting = ref(false)
const languages = ref<IApiLanguage[]>([])
const notes_collapsed = ref(false)
const target_languages_collapsed = ref(false)
const users_collapsed = ref(false)
const entries_collapsed = ref(false)
const import_window_open = ref(false)

const project_form = ref<INewProjectForm>({
  title: '',
  description: '',
  notes: [] as string[],
  source_language_id: 1,
  languages: [] as IApiLanguage[],
  contributors: [] as IApiUser[],
  entries: [{ content: '', context: '' }] as INewEntry[],
})

const form_valid = computed(() => {
  return (
    project_form.value.title &&
    project_form.value.languages.length > 0 &&
    project_form.value.entries.length > 0
  )
})

onMounted(() => {
  FetchData()
})

async function FetchData() {
  try {
    const res = await LanguageService.GetLanguages()
    languages.value = res.data
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

async function SubmitProject() {
  submitting.value = true
  const new_project: INewProject = {
    title: project_form.value.title,
    description: project_form.value.description,
    notes: project_form.value.notes,
    source_language_id: project_form.value.source_language_id,
    languages: project_form.value.languages.map((language) => language.id),
    contributors: project_form.value.contributors.map((user) => user.id),
    entries: project_form.value.entries,
  }
  try {
    const res = await ProjectService.CreateProject(new_project)
    NotificationStore.AddNotification('Project created successfully.', 'success')
    Router.push({ path: '/projects/' + res.data })
  } catch (err: any) {
    if (err.response?.data.message) {
      NotificationStore.AddNotification(err.response.data.message, 'error')
    } else {
      NotificationStore.AddNotification(err.message, 'error')
    }
    submitting.value = false
  }
}

function AddNewNote() {
  if (project_form.value.notes.length < 5) {
    project_form.value.notes.push('')
    notes_collapsed.value = false
  }
}

function DeleteNote(index: number) {
  project_form.value.notes.splice(index, 1)
}

function AddNewEntry() {
  project_form.value.entries.push({ content: '', context: '' })
  entries_collapsed.value = false
}

function DeleteEntry(index: number) {
  project_form.value.entries.splice(index, 1)
}

function HandleSourceLanguageSelected(id: number) {
  project_form.value.source_language_id = id
  project_form.value.languages = project_form.value.languages.filter(
    (language) => language.id !== id,
  )
}

function HandleTargetLanguageSelected(id: number) {
  const language = languages.value.find((language) => language.id === id)!
  if (!project_form.value.languages.find((language) => language.id === id)) {
    project_form.value.languages.push(language)
  } else {
    DeleteTargetLanguage(id)
  }
}

function DeleteTargetLanguage(id: number) {
  project_form.value.languages = project_form.value.languages.filter(
    (language) => language.id !== id,
  )
}

function HandleUserSelected(user: IApiUser) {
  if (!project_form.value.contributors.find((contributor) => contributor.id === user.id)) {
    project_form.value.contributors.push(user)
  } else {
    DeleteUser(user.id)
  }
}

function DeleteUser(id: number) {
  project_form.value.contributors = project_form.value.contributors.filter((user) => user.id !== id)
}

function SaveImportedEntries(new_entries: INewEntry[], mode: 'append' | 'overwrite') {
  if (mode === 'append') {
    project_form.value.entries = project_form.value.entries.concat(new_entries)
  } else {
    project_form.value.entries = new_entries
  }
  import_window_open.value = false
  entries_collapsed.value = false
}
</script>

<template>
  <Loading v-if="loading" />
  <Error v-if="error" :error="error" />

  <main class="ProjectCreate" v-if="!loading && !error">
    <header class="header">
      <h2>Create New Project</h2>
    </header>

    <form class="project-form" @submit.prevent="SubmitProject">
      <!-- DETAILS -->
      <div class="form-section">
        <h3 class="section-title">Project Details</h3>
        <div class="form-item">
          <h4>Title</h4>
          <input
            type="text"
            v-model="project_form.title"
            placeholder="Your project's title"
            class="title-input"
          />
        </div>
        <div class="form-item">
          <h4>Description</h4>
          <textarea
            v-model="project_form.description"
            placeholder="A brief description of your project"
            spellcheck="false"
            class="description-input"
          ></textarea>
        </div>
        <div class="form-item">
          <div class="notes-header">
            <h4>Notes</h4>
            <div class="right">
              <button
                class="primary with-icon add-note"
                type="button"
                @click="AddNewNote"
                :disabled="project_form.notes.length === 5"
              >
                <Icon :icon="ICONS.add" />New Note
              </button>
              <button
                class="secondary icon toggle-notes"
                type="button"
                @click="notes_collapsed = !notes_collapsed"
              >
                <Icon :icon="ICONS.arrow_down" :rotate="notes_collapsed ? 0 : 2" />
              </button>
            </div>
          </div>
          <div class="notes" v-if="!notes_collapsed">
            <div v-if="project_form.notes.length === 0" class="hint">
              Add some notes to guide your contributors! For example: "Please remember about
              punctuation!".
            </div>
            <div class="note" v-for="(_, index) in project_form.notes" :key="index">
              <p class="hint">{{ index + 1 }}.</p>
              <input
                type="text"
                v-model="project_form.notes[index]"
                spellcheck="false"
                placeholder="An empty note"
                class="note-input"
              />
              <button
                type="button"
                class="delete-note tertiary icon danger"
                @click="DeleteNote(index)"
              >
                <Icon :icon="ICONS.delete" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- LANGUAGES -->
      <div class="form-section">
        <h3 class="section-title">Languages</h3>
        <div class="form-item">
          <h4>Source Language</h4>
          <p class="hint">
            The language in which the source text is written. This will be the base for all
            translations.
          </p>
          <LanguageSelect
            :languages="languages"
            :selected="languages.find((lang) => lang.id === project_form.source_language_id)!"
            @language-selected="HandleSourceLanguageSelected"
          />
        </div>

        <div class="form-item">
          <div class="languages-header">
            <h4>Target Languages</h4>
            <button
              type="button"
              class="toggle-languages secondary icon"
              @click="target_languages_collapsed = !target_languages_collapsed"
            >
              <Icon :icon="ICONS.arrow_down" :rotate="target_languages_collapsed ? 0 : 2" />
            </button>
          </div>

          <p class="hint" v-if="!target_languages_collapsed">
            The languages you would like your project to be translated into.
          </p>
          <LanguageSelect
            v-if="!target_languages_collapsed"
            :languages="
              languages.filter((language) => language.id !== project_form.source_language_id)
            "
            :selected="project_form.languages"
            @language-selected="HandleTargetLanguageSelected"
          />

          <div class="selected-languages" v-if="!target_languages_collapsed">
            <div class="lang" v-for="language in project_form.languages" :key="language.id">
              <div class="lang-info panel">
                <Icon :icon="'circle-flags:' + language.code" />
                <span>{{ language.title_eng }} ({{ language.title_native }})</span>
              </div>
              <button
                type="button"
                class="delete-language tertiary icon danger"
                @click="DeleteTargetLanguage(language.id)"
              >
                <Icon :icon="ICONS.delete" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- USERS -->
      <div class="form-section">
        <h3 class="section-title">Contributors</h3>
        <div class="form-item">
          <p class="hint users-header">
            Users you would like to translate your entries. Invites will be sent after the project
            is created.
            <button
              type="button"
              class="toggle-users secondary icon"
              @click="users_collapsed = !users_collapsed"
            >
              <Icon :icon="ICONS.arrow_down" :rotate="users_collapsed ? 0 : 2" />
            </button>
          </p>
          <UserMultiSelect
            v-if="!users_collapsed"
            :selected_users="project_form.contributors"
            @userSelected="HandleUserSelected"
            ignore_self
          />

          <div class="selected-users" v-if="!users_collapsed">
            <div class="user" v-for="user in project_form.contributors" :key="user.id">
              <div class="user-info panel">
                <RouterLink :to="'/users/' + user.id">
                  <p>{{ user.username }}</p>
                </RouterLink>

                <div class="user-stats hint">
                  <p class="stat">
                    <Icon :icon="ICONS.project" />
                    Contributed to {{ user.stats?.joined_projects }}
                    {{ user.stats?.joined_projects === 1 ? 'project' : 'projects' }}
                  </p>
                  <p class="stat">
                    <Icon :icon="ICONS.translation" />
                    {{ user.stats?.translations }}
                    {{ user.stats?.translations === 1 ? 'translation' : 'translations' }} submitted
                  </p>
                  <p class="stat">
                    <Icon :icon="ICONS.user" />
                    {{ UserStatus[user.status] }}
                  </p>
                </div>
              </div>
              <button
                type="button"
                class="delete-user tertiary icon danger"
                @click="DeleteUser(user.id)"
              >
                <Icon :icon="ICONS.delete" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ENTRIES -->
      <div class="form-section entry-section">
        <h3 class="section-title">Entries</h3>
        <div class="form-item">
          <header class="entry-header">
            <p class="hint">
              Entries in the source language to be translated. Each entry should be unique.
            </p>
            <div class="entry-actions">
              <button type="button" class="add-entry primary with-icon" @click="AddNewEntry">
                <Icon :icon="ICONS.add" />New Entry
              </button>
              <button
                type="button"
                class="open-import secondary with-icon"
                @click="import_window_open = true"
              >
                <Icon :icon="ICONS.upload" />Import from CSV
              </button>
              <button
                class="toggle-entries secondary icon"
                type="button"
                @click="entries_collapsed = !entries_collapsed"
              >
                <Icon :icon="ICONS.arrow_down" :rotate="entries_collapsed ? 0 : 2" />
              </button>
            </div>
          </header>

          <div class="entries" v-if="!entries_collapsed">
            <div class="entry" v-for="(_, index) in project_form.entries" :key="index">
              <p class="hint">{{ index + 1 }}.</p>
              <input
                class="entry-content"
                type="text"
                v-model="project_form.entries[index].content"
                spellcheck="false"
                placeholder="An empty entry"
              />
              <input
                class="entry-context"
                type="text"
                v-model="project_form.entries[index].context"
                placeholder="Optional context"
                spellcheck="false"
              />
              <button
                type="button"
                class="delete-entry tertiary icon danger"
                @click="DeleteEntry(index)"
                :disabled="project_form.entries.length === 1"
              >
                <Icon :icon="ICONS.delete" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="actions">
        <div class="stats">
          <p class="hint">
            <Icon :icon="ICONS.project" />
            {{ project_form.entries.length }}
            {{ project_form.entries.length === 1 ? 'entry' : 'entries' }}
          </p>
          <p class="hint">
            <Icon :icon="ICONS.translation" />
            {{ project_form.languages.length }}
            {{ project_form.languages.length === 1 ? 'language' : 'languages' }}
          </p>
          <p class="hint">
            <Icon :icon="ICONS.user" />
            {{ project_form.contributors.length }}
            {{ project_form.contributors.length === 1 ? 'user' : 'users' }}
          </p>
        </div>
        <button class="primary with-icon submit-button" :disabled="submitting || !form_valid">
          <Icon :icon="ICONS.add" />Create New Project
        </button>
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
.ProjectCreate {
  // margin-bottom: 1rem; // leave space for the footer
  .header {
    padding: 1rem 2rem;
  }
}

.project-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 4rem;
  .form-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
    .section-title {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
      &::after {
        content: '';
        flex-grow: 1;
        height: 1px;
        background-color: var(--theme);
      }
    }
    .form-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0 2rem;
      textarea {
        min-height: 5rem;
      }
    }
  }
}

.notes-header,
.languages-header,
.users-header {
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

.selected-languages,
.selected-users {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  .lang,
  .user {
    display: flex;
    gap: 0.5rem;
    font-size: 0.9rem;
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
    align-items: center;
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
  position: sticky;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // width: calc(100% - 2rem);
  left: 0;
  bottom: 0;
  padding: 0.5rem 1rem;
  background: var(--background);
  .stats {
    display: flex;
    align-items: center;
    gap: 1rem;
    p {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      svg {
        color: var(--theme);
      }
    }
  }
}
</style>
