import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { useNotificationStore } from '@/stores/NotificationStore'
import ProjectCreateEdit from '../ProjectCreateEdit.vue'

describe('ProjectCreateEdit', () => {
  let component: any
  let NotificationStore: any

  beforeEach(() => {
    component = mount(ProjectCreateEdit, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
          createRouter({
            history: createWebHistory(),
            routes: [{ path: '/', component: ProjectCreateEdit }],
          }),
        ],
      },
    })
    NotificationStore = useNotificationStore()
  })

  it('renders correctly', () => {
    expect(component).toBeTruthy()
  })
})
