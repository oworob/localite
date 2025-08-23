import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { projects } from '@/assets/testing/test-projects'
import { users } from '@/assets/testing/test-users'
import { useAuthStore } from '../AuthStore'
import { useProjectStore } from '../ProjectStore'

describe('ProjectStore', () => {
  let store: ReturnType<typeof useProjectStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useProjectStore()
  })

  it('sets the project, selected entry and language', () => {
    store.SetProject(projects[0])
    expect(store.project).toEqual(projects[0])
    expect(store.selected_entry).toEqual(projects[0].entries![0])
    expect(store.selected_language).toEqual(projects[0].languages![0])
  })

  it('sets the selected entry', () => {
    store.SetProject(projects[0])
    store.SetSelectedEntry(2)
    expect(store.selected_entry!.id).toBe(2)
  })

  it('sets the selected language', () => {
    store.SetProject(projects[0])
    store.SetSelectedLanguage(2)
    expect(store.selected_language!.id).toBe(2)
  })

  it('checks if the user is the owner of the project', () => {
    store.SetProject(projects[0])
    expect(store.IsProjectOwner()).toBe(false)
    const auth_store = useAuthStore()
    auth_store.SetUser(users[0])
    expect(store.IsProjectOwner()).toBe(true)
  })
})
