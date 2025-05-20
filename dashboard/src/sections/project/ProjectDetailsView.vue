<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ICONS } from '@/assets/icons'
import ProjectService from '@/services/ProjectService'
import { useConfirmStore } from '@/stores/ConfirmSTore'
import { useNotificationStore } from '@/stores/NotificationStore'
import { useProjectStore } from '@/stores/ProjectStore'
import { FormatDate } from '@/tools/FormatDate'

const ProjectStore = useProjectStore()
const NotificationStore = useNotificationStore()
const ConfirmStore = useConfirmStore()
const router = useRouter()

const details_edit_mode = ref(false)

async function LeaveProject() {
  const confirmed = await ConfirmStore.Open(
    'Leave Project?',
    'This cannot be undone. You will have to be invited back if you ever wish to return. Your translations will be saved.',
    'Leave',
    'Cancel',
    true,
  )
  if (!confirmed) return
  ProjectService.LeaveProject(ProjectStore.project!.id)
    .then(() => {
      ProjectStore.ClearProject()
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
    'This cannot be undone. All your entries and translations will be deleted.',
    'Delete',
    'Cancel',
    true,
  )
  if (!confirmed) return
  // todo console.log('Delete Project')
}
</script>

<template>
  <main id="ProjectInfoView">
    <div class="project-info">
      <div class="content">
        <div class="data panel">
          <div class="header">
            <h3>Project Details</h3>
            <button
              class="secondary with-icon"
              v-if="!details_edit_mode && ProjectStore.IsProjectOwner()"
              @click="details_edit_mode = true"
            >
              <Icon :icon="ICONS.edit" />
              Edit
            </button>
            <button
              class="primary with-icon"
              v-if="details_edit_mode"
              @click="details_edit_mode = false"
            >
              <Icon :icon="ICONS.save" />
              Save
            </button>
          </div>
          <div class="form-item">
            <p class="hint">Title:</p>
            <p v-if="!details_edit_mode">{{ ProjectStore.project!.title }}</p>
            <input
              v-else
              type="text"
              v-model="ProjectStore.project!.title"
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
              v-model="ProjectStore.project!.description"
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
        </div>

        <div class="notes panel">
          <h3>Notes from the owner:</h3>
          <p v-if="ProjectStore.project!.notes!.length === 0" class="hint">
            The owner has not added any notes.
          </p>
          <ol v-else>
            <li v-for="note in ProjectStore.project!.notes" :key="note.id">{{ note.content }}</li>
          </ol>
        </div>

        <div class="danger-zone panel">
          <h3>Danger Zone</h3>
          <div class="actions">
            <button class="secondary danger with-icon" @click="LeaveProject">
              <Icon :icon="ICONS.leave" />
              Leave Project
            </button>
            <button class="secondary danger with-icon" @click="DeleteProject">
              <Icon :icon="ICONS.delete" />
              Delete Project
            </button>
          </div>
        </div>

        <div class="updates panel">
          <h3>Changelog</h3>
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

.notes {
  ol li::marker {
    color: var(--theme);
    font-weight: bold;
  }
}

.data,
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
</style>
