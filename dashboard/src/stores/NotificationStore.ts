import { defineStore } from 'pinia'
import type { INotification } from '@/models/system/notification'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as INotification[],
  }),

  actions: {
    AddNotification(message: string, type: 'success' | 'info' | 'warn' | 'error') {
      const id = Date.now()
      this.notifications.push({ id, message, type, removing: false })
      setTimeout(() => {
        this.RemoveNotification(id)
      }, 2000)
    },

    RemoveNotification(id: number) {
      const notification = this.notifications.find((n) => n.id === id)
      if (notification) {
        notification.removing = true
        setTimeout(() => {
          this.notifications = this.notifications.filter((n) => n.id !== id)
        }, 500)
      }
    },
  },
})
