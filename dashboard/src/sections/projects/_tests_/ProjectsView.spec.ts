import { createTestingPinia } from '@pinia/testing'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { invites } from '@/assets/testing/test-invites'
import { projects } from '@/assets/testing/test-projects'
import { users } from '@/assets/testing/test-users'
import InviteService from '@/services/InviteService'
import ProjectService from '@/services/ProjectService'
import { useAuthStore } from '@/stores/AuthStore'
import ProjectsView from '../ProjectsView.vue'

describe('ProjectsView', () => {
  let component: any
  let AuthStore: ReturnType<typeof useAuthStore>
  vi.spyOn(ProjectService, 'GetProjects').mockResolvedValue({ data: projects, status: 200 })
  vi.spyOn(InviteService, 'GetInvites').mockResolvedValue({ data: invites, status: 200 })

  beforeEach(() => {
    component = mount(ProjectsView, {
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
            routes: [
              { path: '/', component: { template: '<div>Home</div>' } },
              { path: '/projects', component: { template: '<div>Projects</div>' } },
              { path: '/projects/:id', component: { template: '<div>Project</div>' } },
            ],
          }),
        ],
      },
    })
    AuthStore = useAuthStore()
  })

  it('renders correctly', () => {
    expect(component).toBeTruthy()
  })

  it('fetches data', async () => {
    expect(component.vm.projects).toEqual(projects)
    expect(component.vm.invites).toEqual(invites)
  })

  it('handles errors when fetching data', async () => {
    vi.spyOn(ProjectService, 'GetProjects').mockRejectedValueOnce(new Error('An error occured'))
    await component.vm.FetchData()
    expect(component.vm.error).toBe('An error occured')

    vi.spyOn(ProjectService, 'GetProjects').mockRejectedValueOnce({
      response: { data: { message: 'Failed to fetch projects' } },
    })
    await component.vm.FetchData()
    expect(component.vm.error).toBe('Failed to fetch projects')
  })

  it('handles accepting and declining invites', async () => {
    expect(component.vm.invites).toEqual(invites)
    component.vm.HandleInviteDecline(invites[0].id)
    expect(component.vm.invites).toEqual(invites.filter((i) => i.id !== invites[0].id))

    component.vm.HandleInviteAccept(invites[1].id)
    expect(ProjectService.GetProjects).toHaveBeenCalled()
  })

  it('shows the correct invite header', async () => {
    expect(component.vm.invites.length).toBe(invites.length)
    const header = component.find('.invites header')
    expect(header.text()).toBe(`Invites (${invites.length})`)

    component.vm.invites = []
    await flushPromises()
    expect(header.text()).toBe('Invites')
  })
})
