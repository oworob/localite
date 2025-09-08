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

  it('checks if the user is the owner of the project', () => {
    store.SetProject(projects[0])
    expect(store.IsProjectOwner()).toBe(false)
    const auth_store = useAuthStore()
    auth_store.SetUser(users[0])
    expect(store.IsProjectOwner()).toBe(true)
  })
})
