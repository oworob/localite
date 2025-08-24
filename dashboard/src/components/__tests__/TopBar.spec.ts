import { createTestingPinia } from '@pinia/testing'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { users } from '@/assets/testing/test-users'
import AuthService from '@/services/AuthService'
import { useAuthStore } from '@/stores/AuthStore'
import TopBar from '../TopBar.vue'

describe('TopBar', () => {
  let component: any
  let AuthStore: any

  beforeEach(() => {
    component = shallowMount(TopBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              AuthStore: {
                user: users[0],
              },
            },
          }),
          createRouter({
            history: createWebHistory(),
            routes: [{ path: '/:pathMatch(.*)', component: { template: '<div>Section</div>' } }],
          }),
        ],
      },
    })
    AuthStore = useAuthStore()
  })

  it('renders correctly', () => {
    expect(component).toBeTruthy()
  })

  it('renders the user menu if logged in', () => {
    expect(component.find('.user').exists()).toBe(true)
  })

  it('does not render the user menu if not logged in', async () => {
    AuthStore.user = null
    await flushPromises()
    expect(component.find('.user').exists()).toBe(false)
  })

  it('logs out the user', async () => {
    vi.spyOn(AuthService, 'Logout').mockResolvedValueOnce({ data: '', status: 200 })
    await component.find('.logout').trigger('click')
    expect(AuthService.Logout).toHaveBeenCalled()
    expect(AuthStore.SetUser).toHaveBeenCalled()
  })
})
