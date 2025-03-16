import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { INotification } from '@/models/system/notification'

export const useNotificationStore = defineStore('NotificationStore', () => {
  const notifications = ref<INotification[]>([])

  function AddNotification(message: string, type: 'success' | 'info' | 'warn' | 'error') {
    const id = Date.now()
    notifications.value.push({ id, message, type, removing: false })
    setTimeout(() => {
      RemoveNotification(id)
    }, 2000)
  }

  function RemoveNotification(id: number) {
    const notification = notifications.value.find((n) => n.id === id)
    if (notification) {
      notification.removing = true
      setTimeout(() => {
        notifications.value = notifications.value.filter((n) => n.id !== id)
      }, 500)
    }
  }

  return { notifications, AddNotification, RemoveNotification }
})
