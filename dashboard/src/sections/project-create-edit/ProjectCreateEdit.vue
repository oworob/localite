<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
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
const submitting = ref(false)
const title = ref('')
const description = ref('')
const notes = ref<string[]>([])
const notes_collapsed = ref(false)
const desired_languages_collapsed = ref(false)
const users_collapsed = ref(false)
const languages = ref<IApiLanguage[]>([])
const selected_original_language = ref<IApiLanguage>()
const selected_desired_languages = ref<IApiLanguage[]>([])
const selected_users = ref<IApiUser[]>([])
const entries = ref<INewEntry[]>([{ content: '', context: '' }])
const entries_collapsed = ref(false)
const import_window_open = ref(false)

const NotificationStore = useNotificationStore()
const router = useRouter()

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
    selected_users.value = selected_users.value.filter(
      (selected_user) => selected_user.id !== user.id,
    )
  }
}

function SaveImportedEntries(new_entries: INewEntry[], mode: 'append' | 'overwrite') {
  if (mode === 'append') {
    entries.value = entries.value.concat(new_entries)
  } else {
    entries.value = new_entries
  }
  import_window_open.value = false
  entries_collapsed.value = false
}
</script>

<template>
  <Loading v-if="loading" />

  <main class="ProjectCreateEdit" v-if="!loading">
    <header class="header">
      <h2>Create New Project</h2>
    </header>

    <form class="project-form" @submit.prevent="Submit">
      <!-- DETAILS -->
      <div class="form-section">
        <h3 class="section-title">I. Project Details</h3>
        <div class="form-item">
          <h4>Title</h4>
          <input type="text" v-model="title" placeholder="Your project's title" />
        </div>
        <div class="form-item">
          <h4>Description</h4>
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
              <button
                class="primary with-icon"
                type="button"
                @click="AddNewNote"
                :disabled="notes.length === 5"
              >
                <Icon :icon="ICONS.add" />New Note
              </button>
              <button
                class="secondary icon"
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
              <button type="button" class="tertiary icon danger" @click="DeleteNote(index)">
                <Icon :icon="ICONS.delete" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- LANGUAGES -->
      <div class="form-section">
        <h3 class="section-title">II. Languages</h3>
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
          <div class="languages-header">
            <h4>Desired Languages</h4>
            <button
              type="button"
              class="secondary icon"
              @click="desired_languages_collapsed = !desired_languages_collapsed"
            >
              <Icon :icon="ICONS.arrow_down" :rotate="desired_languages_collapsed ? 0 : 2" />
            </button>
          </div>

          <p class="hint" v-if="!desired_languages_collapsed">
            The languages you would like your project to be translated into.
          </p>
          <LanguageMultiSelect
            v-if="!desired_languages_collapsed"
            :languages="
              languages.filter((language) => language.id !== selected_original_language?.id)
            "
            :selected_languages="selected_desired_languages"
            @language-selected="HandleDesiredLanguageSelected"
          />

          <div class="selected-languages" v-if="!desired_languages_collapsed">
            <div class="lang" v-for="language in selected_desired_languages" :key="language.id">
              <div class="lang-info panel">
                <Icon :icon="'circle-flags:' + language.code" />
                <span>{{ language.title_eng }} ({{ language.title_native }})</span>
              </div>
              <button
                type="button"
                class="tertiary icon danger"
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

      <!-- USERS -->
      <div class="form-section">
        <h3 class="section-title">III. Contributors</h3>
        <div class="form-item">
          <p class="hint users-header">
            Users you would like to translate your entries. Invites will be sent after the project
            is created.
            <button
              type="button"
              class="secondary icon"
              @click="users_collapsed = !users_collapsed"
            >
              <Icon :icon="ICONS.arrow_down" :rotate="users_collapsed ? 0 : 2" />
            </button>
          </p>
          <UserMultiSelect
            v-if="!users_collapsed"
            :selected_users="selected_users"
            @userSelected="HandleUserSelected"
            ignore_self
          />

          <div class="selected-users" v-if="!users_collapsed">
            <div class="user" v-for="user in selected_users" :key="user.id">
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
                class="tertiary icon danger"
                @click="selected_users.splice(selected_users.indexOf(user), 1)"
              >
                <Icon :icon="ICONS.delete" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ENTRIES -->
      <div class="form-section entry-section">
        <h3 class="section-title">IV. Entries</h3>
        <div class="form-item">
          <header class="entry-header">
            <p class="hint">
              Entries in {{ selected_original_language?.title_eng }} ({{
                selected_original_language?.title_native
              }}) to be translated. Each entry should be unique.
            </p>
            <div class="entry-actions">
              <button type="button" class="primary with-icon" @click="AddNewEntry">
                <Icon :icon="ICONS.add" />New Entry
              </button>
              <button type="button" class="secondary with-icon" @click="import_window_open = true">
                <Icon :icon="ICONS.upload" />Import from CSV
              </button>
              <button
                class="secondary icon"
                type="button"
                @click="entries_collapsed = !entries_collapsed"
              >
                <Icon :icon="ICONS.arrow_down" :rotate="entries_collapsed ? 0 : 2" />
              </button>
            </div>
          </header>

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
                class="tertiary icon danger"
                @click="DeleteEntry(index)"
                :disabled="entries.length === 1"
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
            {{ entries.length }} {{ entries.length === 1 ? 'entry' : 'entries' }}
          </p>
          <p class="hint">
            <Icon :icon="ICONS.translation" />
            {{ selected_desired_languages.length }}
            {{ selected_desired_languages.length === 1 ? 'language' : 'languages' }}
          </p>
          <p class="hint">
            <Icon :icon="ICONS.user" />
            {{ selected_users.length }} {{ selected_users.length === 1 ? 'user' : 'users' }}
          </p>
        </div>
        <button
          class="primary with-icon submit-button"
          :disabled="submitting || !title || selected_desired_languages.length === 0"
        >
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
.ProjectCreateEdit {
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
