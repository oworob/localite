import { defineStore } from 'pinia'
import type { IApiUser } from '@/models/user/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as IApiUser | null,
  }),

  actions: {
    SetUser(user: IApiUser | null) {
      this.user = user
    },
  },
})
