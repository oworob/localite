<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { onClickOutside } from '@vueuse/core'
import { onMounted, onUnmounted, ref } from 'vue'
import { ICONS } from '@/assets/icons'
import { type IApiMessage } from '@/models/user/message'
import LiveService from '@/services/LiveService'
import MessageService from '@/services/MessageService'
import { useNotificationStore } from '@/stores/NotificationStore'
import { FormatDate } from '@/tools/FormatDate'

const NotificationStore = useNotificationStore()

const messages_window_open = ref(false)
const messages = ref<IApiMessage[]>([])

const component = ref(null)
onClickOutside(component, (event) => {
  messages_window_open.value = false
})

function MessageReceived(message: IApiMessage) {
  messages.value.push(message)
}

onMounted(() => {
  MessageService.GetMessages().then((res) => {
    messages.value = res.data
  })
  LiveService.socket.on('new_message', MessageReceived)
})

onUnmounted(() => {
  LiveService.socket.off('new_message', MessageReceived)
})

async function MarkAsRead(message: IApiMessage) {
  try {
    await MessageService.MarkMessageAsRead(message.id)
    message.read = true
  } catch (err: any) {
    if (err.response?.data.message) {
      NotificationStore.AddNotification(err.response.data.message, 'error')
    } else {
      NotificationStore.AddNotification(err.message, 'error')
    }
  }
}

async function DeleteMessage(message: IApiMessage) {
  try {
    await MessageService.DeleteMessage(message.id)
    messages.value = messages.value.filter((m) => m.id !== message.id)
  } catch (err: any) {
    if (err.response?.data.message) {
      NotificationStore.AddNotification(err.response.data.message, 'error')
    } else {
      NotificationStore.AddNotification(err.message, 'error')
    }
  }
}
</script>

<template>
  <div id="Messages" ref="component">
    <button
      class="toggle icon"
      :class="messages_window_open ? 'primary' : 'tertiary'"
      @click="messages_window_open = !messages_window_open"
      aria-label="Theme editor toggle"
    >
      <Icon :icon="ICONS.message" />
      <span class="alert" v-if="messages.some((msg) => !msg.read)"></span>
    </button>

    <div class="message-window panel" v-if="messages_window_open">
      <p class="hint no-messages" v-if="messages.length === 0">There are no new messages.</p>
      <div
        class="message panel hover"
        v-for="message in messages"
        :key="message.id"
        :class="{ unread: !message.read }"
      >
        <RouterLink
          v-if="message.link"
          class="main"
          :to="message.link"
          @click="(MarkAsRead(message), (messages_window_open = false))"
        >
          <span class="hint">{{ FormatDate(message.created_at, true, true) }}</span>
          <p class="content">{{ message.content }}</p>
        </RouterLink>

        <button class="main" v-else @click="MarkAsRead(message)">
          <span class="hint">{{ FormatDate(message.created_at, true, true) }}</span>
          <p class="content">{{ message.content }}</p>
        </button>

        <div class="actions">
          <button class="delete icon tertiary danger" @click="DeleteMessage(message)">
            <Icon :icon="ICONS.delete" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#Messages {
  position: relative;
  .toggle {
    &.primary .alert {
      outline-color: var(--theme);
    }
    &:has(.alert) {
      animation: shake 0.5s;
    }
    .alert {
      transition: var(--transition);
      position: absolute;
      width: 8px;
      height: 8px;
      background-color: var(--warn);
      outline: 2px solid var(--background);
      border-radius: 50%;
      transform: translate(160%, -10%);
    }
  }

  .message-window {
    position: absolute;
    top: 110%;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    width: max-content;
    width: 30rem;
    .message {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &.unread {
        .content {
          font-weight: bold;
        }
      }
      .main {
        flex: 1;
        text-align: left;
        padding-left: 0;
      }
    }
  }
}

@keyframes shake {
  0% {
    rotate: 0deg;
  }
  25% {
    rotate: -7deg;
  }
  50% {
    rotate: 14deg;
  }
  75% {
    rotate: -7deg;
  }
  100% {
    rotate: 0deg;
  }
}
</style>
