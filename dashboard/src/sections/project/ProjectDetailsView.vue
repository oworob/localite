<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ICONS } from '@/assets/icons'
import ProjectService from '@/services/ProjectService'
import { useConfirmStore } from '@/stores/ConfirmStore'
import { useNotificationStore } from '@/stores/NotificationStore'
import { useProjectStore } from '@/stores/ProjectStore'
import { FormatDate, FormatTime } from '@/tools/FormatDate'

const ProjectStore = useProjectStore()
const NotificationStore = useNotificationStore()
const ConfirmStore = useConfirmStore()
const router = useRouter()

const details_edit_mode = ref(false)
const notes_edit_mode = ref(false)
const show_changelog = ref(true)
const submitting = ref(false)

const title_desc_form = ref({
  title: '',
  description: '',
})

const notes_form = ref<string[]>([])

const emit = defineEmits(['refreshProject'])

function EnterDetailsEditMode() {
  title_desc_form.value.title = ProjectStore.project!.title!
  title_desc_form.value.description = ProjectStore.project!.description!
  details_edit_mode.value = true
}

function EnterNotesEditMode() {
  notes_edit_mode.value = true
  notes_form.value = ProjectStore.project!.notes!.map((note) => note.content)
}

function AddNote() {
  notes_form.value.push('')
}

async function LeaveProject() {
  const confirmed = await ConfirmStore.Open(
    'Leave Project?',
    'You will have to be invited back if you ever wish to return. Your submitted translations will not be deleted.',
    'Leave',
    'Cancel',
    true,
  )
  if (!confirmed) return
  ProjectService.LeaveProject(ProjectStore.project!.id)
    .then(() => {
      NotificationStore.AddNotification('You have left the project.', 'success')
      router.push('/projects')
    })
    .catch((err) => {
      if (err.response?.data.message) {
        NotificationStore.AddNotification(err.response.data.message, 'error')
      } else {
        NotificationStore.AddNotification(err.message, 'error')
      }
    })
}

async function DeleteProject() {
  const confirmed = await ConfirmStore.Open(
    'Delete Project?',
    'This cannot be undone. All entries and translations will be deleted.',
    'Delete',
    'Cancel',
    true,
  )
  if (!confirmed) return
  submitting.value = true
  try {
    await ProjectService.DeleteProject(ProjectStore.project!.id!)
    router.push('/projects')
    NotificationStore.AddNotification('Project deleted successfully.', 'success')
  } catch (err: any) {
    if (err.response?.data.message) {
      NotificationStore.AddNotification(err.response.data.message, 'error')
    } else {
      NotificationStore.AddNotification(err.message, 'error')
    }
    submitting.value = false
  }
}

async function UpdateDetails() {
  submitting.value = true
  try {
    await ProjectService.UpdateProjectDetails(ProjectStore.project!.id!, title_desc_form.value)
    NotificationStore.AddNotification('Project details updated successfully.', 'success')
    emit('refreshProject')
    details_edit_mode.value = false
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

async function UpdateNotes() {
  submitting.value = true
  try {
    await ProjectService.UpdateProjectNotes(ProjectStore.project!.id!, notes_form.value)
    NotificationStore.AddNotification('Notes updated successfully.', 'success')
    emit('refreshProject')
    notes_edit_mode.value = false
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
</script>

<template>
  <main id="ProjectInfoView">
    <div class="project-info">
      <div class="content">
        <div class="details panel">
          <div class="header">
            <h3>Project Details</h3>
            <div class="actions">
              <button
                class="secondary with-icon"
                v-if="!details_edit_mode && ProjectStore.IsProjectOwner()"
                @click="EnterDetailsEditMode"
              >
                <Icon :icon="ICONS.edit" />
                Edit
              </button>
              <button
                class="primary with-icon"
                v-if="details_edit_mode"
                @click="UpdateDetails"
                :disabled="
                  submitting ||
                  (title_desc_form.title === ProjectStore.project?.title &&
                    title_desc_form.description === ProjectStore.project?.description)
                "
              >
                <Icon :icon="ICONS.save" />
                Save
              </button>
              <button
                class="secondary with-icon danger"
                v-if="details_edit_mode"
                @click="details_edit_mode = false"
                :disabled="submitting"
              >
                <Icon :icon="ICONS.delete" />
                Discard
              </button>
            </div>
          </div>
          <div class="form-item">
            <p class="hint">Title:</p>
            <p v-if="!details_edit_mode">{{ ProjectStore.project!.title }}</p>
            <input
              v-else
              type="text"
              v-model="title_desc_form.title"
              placeholder="Project Title"
              class="input"
            />
          </div>
          <div class="form-item">
            <p class="hint">Description:</p>
            <p v-if="!details_edit_mode">{{ ProjectStore.project!.description }}</p>
            <textarea
              v-else
              type="text"
              v-model="title_desc_form.description"
              placeholder="A brief description of your project"
              spellcheck="false"
              class="input"
            />
          </div>
          <div>
            <p class="hint">Owner:</p>
            <p>{{ ProjectStore.project!.owner!.username }}</p>
          </div>

          <div>
            <p class="hint">Date Created:</p>
            <p>{{ FormatDate(ProjectStore.project!.created_at, true) }}</p>
          </div>

          <div>
            <p class="hint">Source Language:</p>
            <span class="lang">
              <Icon :icon="'circle-flags:' + ProjectStore.project!.source_language!.code" />
              {{ ProjectStore.project!.source_language!.title_eng }} ({{
                ProjectStore.project!.source_language!.title_native
              }})
            </span>
          </div>

          <div class="languages">
            <p class="hint">Target Languages:</p>
            <div class="langs">
              <span class="lang" v-for="lang in ProjectStore.project!.languages" :key="lang.id">
                <Icon :icon="'circle-flags:' + lang.code" />
                {{ lang.title_eng }} ({{ lang.title_native }})
              </span>
            </div>
          </div>
        </div>

        <div class="notes panel">
          <div class="header">
            <h3>Notes from the owner:</h3>
            <div class="actions">
              <button
                class="secondary with-icon"
                v-if="!notes_edit_mode && ProjectStore.IsProjectOwner()"
                @click="EnterNotesEditMode"
              >
                <Icon :icon="ICONS.edit" />
                Edit
              </button>
              <button
                class="primary with-icon"
                v-if="notes_edit_mode"
                @click="AddNote()"
                :disabled="submitting || notes_form.length >= 5"
              >
                <Icon :icon="ICONS.add" />
                New Note
              </button>
              <button
                class="primary with-icon"
                v-if="notes_edit_mode"
                @click="UpdateNotes"
                :disabled="
                  submitting ||
                  JSON.stringify(notes_form) ===
                    JSON.stringify(ProjectStore.project!.notes!.map((note) => note.content))
                "
              >
                <Icon :icon="ICONS.save" />
                Save
              </button>
              <button
                class="secondary with-icon danger"
                v-if="notes_edit_mode"
                @click="notes_edit_mode = false"
                :disabled="submitting"
              >
                <Icon :icon="ICONS.delete" />
                Discard
              </button>
            </div>
          </div>
          <div class="notes-list" v-if="!notes_edit_mode">
            <p v-if="ProjectStore.project!.notes!.length === 0" class="hint">
              The owner has not added any notes.
            </p>
            <ol v-else>
              <li v-for="note in ProjectStore.project!.notes" :key="note.id">{{ note.content }}</li>
            </ol>
          </div>
          <div class="notes-inputs" v-else>
            <p class="hint" v-if="notes_form.length === 0">
              Add some notes to guide your contributors! For example: "Please remember about
              punctuation!".
            </p>
            <div class="note" v-for="(_, index) in notes_form" :key="index">
              <p class="hint">{{ index + 1 }}.</p>
              <input
                type="text"
                v-model="notes_form[index]"
                spellcheck="false"
                placeholder="An empty note"
                class="input"
              />
              <button
                type="button"
                class="delete-note tertiary icon danger"
                @click="notes_form.splice(index, 1)"
              >
                <Icon :icon="ICONS.delete" />
              </button>
            </div>
          </div>
        </div>

        <div class="updates panel">
          <header class="header">
            <h3>Changelog</h3>
            <button
              class="toggle-changelog secondary icon"
              type="button"
              @click="show_changelog = !show_changelog"
            >
              <Icon :icon="ICONS.arrow_down" :rotate="!show_changelog ? 0 : 2" />
            </button>
          </header>
          <div class="content">
            <div v-if="show_changelog" class="update-list">
              <div
                v-for="(update, i) in ProjectStore.project!.updates"
                :key="update.id"
                class="update-item"
              >
                <p
                  class="hint date"
                  v-if="
                    i == 0 ||
                    FormatDate(update.created_at, true) !==
                      FormatDate(ProjectStore.project!.updates![i - 1].created_at, true)
                  "
                >
                  {{ FormatDate(update.created_at, true) }}
                </p>
                <p class="update-content">
                  <span class="hint">{{ FormatTime(update.created_at) }} - </span>
                  {{ update.content }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="danger-zone panel">
          <h3>Danger Zone</h3>
          <div class="actions">
            <button class="secondary danger with-icon" @click="LeaveProject" :disabled="submitting">
              <Icon :icon="ICONS.leave" />
              Leave Project
            </button>

            <button
              class="secondary danger with-icon"
              v-if="ProjectStore.IsProjectOwner()"
              :disabled="submitting"
            >
              <Icon :icon="ICONS.users" />
              Transfer Ownership
            </button>
            <button
              class="secondary danger with-icon"
              @click="DeleteProject"
              v-if="ProjectStore.IsProjectOwner()"
              :disabled="submitting"
            >
              <Icon :icon="ICONS.delete" />
              Delete Project
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.project-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  .header {
    display: flex;
    justify-content: space-between;
  }
  > .content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 1rem;
  }
}

.notes-list {
  ol li {
    margin-bottom: 0.5rem;
    &::marker {
      color: var(--theme);
      font-weight: bold;
    }
  }
}

.notes-inputs {
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

.details,
.notes,
.danger-zone {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .header {
    display: flex;
    align-items: center;
  }
  .form-item {
    display: flex;
    flex-direction: column;
    input,
    textarea {
      margin-top: 0.5rem;
    }
    textarea {
      min-height: 5rem;
    }
  }
  .actions {
    display: flex;
    gap: 0.5rem;
  }
}

.danger-zone {
  grid-column: span 2;
}

.updates {
  grid-column: span 2;
  .update-list {
    .update-content {
      margin-left: 1rem;
    }
  }
}

.details {
  .lang {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  .langs {
    display: flex;
    flex-wrap: wrap;
    column-gap: 1rem;
  }
}
</style>
