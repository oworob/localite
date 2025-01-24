import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IApiEntry } from '@/models/project/entry'
import type IApiLanguage from '@/models/project/language'
import type { IApiProject } from '@/models/project/project'

export const useProjectStore = defineStore('project', () => {
  const project = ref<IApiProject>()
  const selected_entry = ref<IApiEntry>()
  const selected_language = ref<IApiLanguage>()

  function SetProject(new_project: IApiProject) {
    project.value = new_project
    selected_entry.value = new_project.entries![0]
    selected_language.value = new_project.languages![0]
  }

  function SetSelectedEntry(id: number) {
    selected_entry.value = project.value!.entries!.find((entry) => entry.id === id)
  }

  function SetSelectedLanguage(id: number) {
    selected_language.value = project.value!.languages!.find((language) => language.id === id)
  }

  return {
    project,
    selected_entry,
    selected_language,
    SetProject,
    SetSelectedEntry,
    SetSelectedLanguage,
  }
})
