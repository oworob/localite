import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IApiProject } from '@/models/project/project'
import { useAuthStore } from './AuthStore'

export const useProjectStore = defineStore('ProjectStore', () => {
  const project = ref<IApiProject>()

  function SetProject(new_project: IApiProject) {
    project.value = new_project
  }

  function IsProjectOwner(): boolean {
    const AuthStore = useAuthStore()
    if (!AuthStore.user) return false
    return project.value!.owner_id === AuthStore.user?.id
  }

  return {
    project,
    SetProject,
    IsProjectOwner,
  }
})
