import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { app_stats } from '@/assets/testing/test-app-stats'
import { users } from '@/assets/testing/test-users'
import AuthService from '@/services/AuthService'
import MiscService from '@/services/MiscService'
import { useAuthStore } from '@/stores/AuthStore'
import { useNotificationStore } from '@/stores/NotificationStore'
import LoginRegister from './LoginRegister.vue'

describe('LoginRegister', () => {
  let component: any
  let NotificationStore: ReturnType<typeof useNotificationStore>
  let AuthStore: ReturnType<typeof useAuthStore>
  vi.spyOn(AuthService, 'Register').mockResolvedValue({ data: users[0], status: 200 })
  vi.spyOn(AuthService, 'Login').mockResolvedValue({ data: users[0], status: 200 })
  vi.spyOn(MiscService, 'GetAppStats').mockResolvedValue({ data: app_stats, status: 200 })

  beforeEach(() => {
    component = mount(LoginRegister, {
      props: {
        mode: 'login',
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
          createRouter({
            history: createWebHistory(),
            routes: [
              { path: '/login', component: LoginRegister },
              { path: '/register', component: LoginRegister },
              { path: '/projects', component: { template: '<div>Projects</div>' } },
              { path: '/', component: { template: '<div>Home</div>' } },
            ],
          }),
        ],
      },
    })
    NotificationStore = useNotificationStore()
    AuthStore = useAuthStore()
  })

  it('renders correctly', () => {
    expect(component).toBeTruthy()
  })

  it('renders correct mode', async () => {
    expect(component.find('.submit-button').text()).toBe('Login')
    await component.setProps({ mode: 'register' })
    expect(component.find('.submit-button').text()).toBe('Create an Account')
  })

  it('animates app stats', () => {
    vi.useFakeTimers()
    component.vm.app_stats = app_stats
    const interval_spy = vi.spyOn(global, 'clearInterval')
    component.vm.AnimateStats()
    vi.advanceTimersByTime(1000)
    expect(component.vm.app_stats.entries).toBe(app_stats.entries)
    expect(interval_spy).toHaveBeenCalled()
  })

  it('successfully logs in', async () => {
    await component.find('.username-input').setValue(users[0].username)
    await component.find('.password-input').setValue('password')
    await component.find('form').trigger('submit.prevent')
    expect(AuthService.Login).toHaveBeenCalled()
    expect(NotificationStore.AddNotification).toHaveBeenCalled()
    expect(AuthStore.SetUser).toHaveBeenCalledWith(users[0])
  })

  it('handles login error', async () => {
    vi.spyOn(AuthService, 'Login').mockRejectedValueOnce({
      response: { data: { message: 'Failed to log in' } },
    })
    await component.find('.username-input').setValue(users[0].username)
    await component.find('.password-input').setValue('password')
    await component.find('form').trigger('submit.prevent')
    expect(NotificationStore.AddNotification).toHaveBeenCalled()

    vi.spyOn(AuthService, 'Login').mockRejectedValueOnce(new Error('An error occurred'))
    await component.find('form').trigger('submit.prevent')
    expect(NotificationStore.AddNotification).toHaveBeenCalled()
  })

  it('successfully registers', async () => {
    await component.setProps({ mode: 'register' })
    await component.find('.username-input').setValue(users[0].username)
    await component.find('.password-input').setValue('password')
    await component.find('form').trigger('submit.prevent')
    expect(AuthService.Register).toHaveBeenCalled()
    expect(NotificationStore.AddNotification).toHaveBeenCalled()
    expect(AuthStore.SetUser).toHaveBeenCalledWith(users[0])
  })

  it('handles register error', async () => {
    vi.spyOn(AuthService, 'Register').mockRejectedValueOnce({
      response: { data: { message: 'Failed to register' } },
    })
    await component.setProps({ mode: 'register' })
    await component.find('.email-input').setValue('email')
    await component.find('.username-input').setValue(users[0].username)
    await component.find('.password-input').setValue('password')
    await component.find('form').trigger('submit.prevent')
    expect(NotificationStore.AddNotification).toHaveBeenCalled()

    vi.spyOn(AuthService, 'Register').mockRejectedValueOnce(new Error('An error occurred'))
    await component.find('form').trigger('submit.prevent')
    expect(NotificationStore.AddNotification).toHaveBeenCalled()
  })
})
