import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { users } from '@/assets/testing/test-users'
import { useAuthStore } from '../AuthStore'

describe('AuthStore', () => {
  let store: ReturnType<typeof useAuthStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAuthStore()
  })

  it('sets the user', () => {
    store.SetUser(users[0])
    expect(store.user).toEqual(users[0])

    store.SetUser(null)
    expect(store.user).toBeNull()
  })
})
