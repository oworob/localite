<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { ref } from 'vue'
import { ICONS } from '@/assets/icons'
import type { IApiInvite } from '@/models/project/invite'
import InviteService from '@/services/InviteService'
import { useNotificationStore } from '@/stores/NotificationStore'

const NotificationStore = useNotificationStore()

const props = defineProps<{
  invite: IApiInvite
}>()

const emit = defineEmits(['accept', 'reject'])

const submitting = ref(false)

function AcceptInvite() {
  InviteService.AcceptInvite(props.invite.id)
    .then(() => {
      emit('accept', props.invite.id)
    })
    .catch((err) => {
      if (err.response?.data.message) {
        NotificationStore.AddNotification(err.response.data.message, 'error')
      } else {
        NotificationStore.AddNotification(err.message, 'error')
      }
      submitting.value = false
    })
}

function DeclineInvite() {
  InviteService.DeclineInvite(props.invite.id)
    .then(() => {
      emit('reject', props.invite.id)
    })
    .catch((err) => {
      if (err.response?.data.message) {
        NotificationStore.AddNotification(err.response.data.message, 'error')
      } else {
        NotificationStore.AddNotification(err.message, 'error')
      }
      submitting.value = false
    })
}
</script>

<template>
  <div class="project panel">
    <header class="header">
      <div class="main">
        <Icon :icon="'circle-flags:' + invite.project?.source_language?.code" />
        <h4>{{ invite.project?.title }}</h4>
        <p class="hint">by {{ invite.project?.owner?.username }}</p>
      </div>
    </header>
    <p class="hint">{{ invite.project?.description }}</p>

    <div class="info">
      <div class="languages">
        <Icon
          v-for="language in invite.project?.languages"
          :key="language.id"
          :icon="'circle-flags:' + language.code"
        />
      </div>
      <div class="other hint">
        <p class="contributors">
          <Icon :icon="ICONS.users" />{{ invite.project?.stats?.contributors }}
        </p>
        <p class="entries"><Icon :icon="ICONS.entry" />{{ invite.project?.stats?.entries }}</p>
      </div>
    </div>

    <div class="actions">
      <button class="primary join" :disabled="submitting" @click="AcceptInvite">Join</button>
      <button class="secondary danger" :disabled="submitting" @click="DeclineInvite">Delete</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.project {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: var(--transition);
  &:hover {
    border-color: var(--theme);
    .languages {
      gap: 0.5rem;
    }
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .main {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .menu-button {
      transition: var(--transition);
      font-size: 1rem;
      &:hover {
        color: var(--theme);
      }
    }
  }
  .info {
    display: flex;
    justify-content: space-between;
    .contributors,
    .entries {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .other {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
  .languages {
    display: flex;
    transition: var(--transition);
    gap: 0;
    svg:not(:first-child) {
      margin-left: -0.25rem;
    }
  }
}

a {
  text-decoration: none;
  color: var(--text);
}

.actions {
  display: flex;
  gap: 0.5rem;
  .join {
    flex-grow: 1;
  }
}
</style>
