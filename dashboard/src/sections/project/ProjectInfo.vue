<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProjectService from '@/services/ProjectService'
import { useNotificationStore } from '@/stores/NotificationStore'
import { useProjectStore } from '@/stores/ProjectStore'
import { FormatDate } from '@/tools/FormatDate'

const ProjectStore = useProjectStore()
const NotificationStore = useNotificationStore()
const emit = defineEmits(['close', 'saveEntries'])
const leave_confirm_open = ref(false)
const router = useRouter()

const component = ref(null)
onClickOutside(component, (event) => {
  if (!leave_confirm_open.value) {
    emit('close')
  }
})

const leave_confirm_component = ref(null)
onClickOutside(leave_confirm_component, (event) => {
  leave_confirm_open.value = false
})

function LeaveProject() {
  ProjectService.LeaveProject(ProjectStore.project!.id)
    .then(() => {
      ProjectStore.ClearProject()
      emit('close')
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
</script>

<template>
  <main id="ProjectInfo" class="modal">
    <div class="panel project-info" ref="component">
      <h3>Project Details</h3>
      <div class="content">
        <div class="data">
          <div class="item">
            <p class="hint">Title:</p>
            <p>{{ ProjectStore.project!.title }}</p>
          </div>
          <div>
            <p class="hint">Owner:</p>
            <p>{{ ProjectStore.project!.owner!.username }}</p>
          </div>
          <div>
            <p class="hint">Description:</p>
            <p>{{ ProjectStore.project!.description || '-' }}</p>
          </div>
          <div>
            <p class="hint">Date Created:</p>
            <p>{{ FormatDate(ProjectStore.project!.created_at, true) }}</p>
          </div>
        </div>

        <div class="notes" v-if="ProjectStore.project!.notes!.length > 0">
          <h4>Notes from the owner:</h4>
          <ol>
            <li v-for="note in ProjectStore.project!.notes" :key="note.id">{{ note.content }}</li>
          </ol>
        </div>
      </div>

      <footer class="actions">
        <RouterLink
          :to="'/projects/' + ProjectStore.project!.id + '/manage'"
          v-if="ProjectStore.IsProjectOwner()"
        >
          <button class="primary">Manage Project</button>
        </RouterLink>
        <button class="secondary danger" @click="leave_confirm_open = true">Leave Project</button>
      </footer>
    </div>

    <div class="leave-confirm modal" v-if="leave_confirm_open">
      <div class="content panel" ref="leave_confirm_component">
        <h3>Leave Project?</h3>
        <p class="hint">
          This cannot be undone. You will have to be invited back if you ever wish to return. Your
          translations will be saved.
        </p>
        <div class="actions">
          <button class="tertiary" @click="leave_confirm_open = false">Cancel</button>
          <button class="primary danger" @click="LeaveProject">Leave</button>
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
  .content {
    display: flex;
    gap: 2rem;
    .data {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    ol li::marker {
      color: var(--theme);
      font-weight: bold;
    }
  }
  .actions {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    margin-top: 1rem;
  }
}

.leave-confirm > .content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .actions {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
  }
}
</style>
