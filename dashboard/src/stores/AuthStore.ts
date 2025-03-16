import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IApiUser } from '@/models/user/user'

export const useAuthStore = defineStore('AuthStore', () => {
  const user = ref<IApiUser | null>(null)

  function SetUser(new_user: IApiUser | null) {
    user.value = new_user
  }

  return { user, SetUser }
})
