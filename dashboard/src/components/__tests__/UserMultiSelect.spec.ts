import { createTestingPinia } from '@pinia/testing'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { users } from '@/assets/testing/test-users'
import UserService from '@/services/UserService'
import { useNotificationStore } from '@/stores/NotificationStore'
import UserMultiSelect from '../UserMultiSelect.vue'

describe('UserMultiSelect', () => {
  let component: any
  let NotificationStore: any

  beforeEach(() => {
    component = mount(UserMultiSelect, {
      props: {
        selected_users: [],
      },
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
        ],
      },
    })
    NotificationStore = useNotificationStore()
  })

  it('renders correctly', () => {
    expect(component).toBeTruthy()
  })

  it('displays the number of selected users', async () => {
    const header = component.find('.select-header span')
    expect(header.text()).toBe('0 users selected')

    await component.setProps({ selected_users: [users[0]] })
    expect(header.text()).toBe('1 user selected')
  })

  it('displays a checkbox for selected users', async () => {
    const header = component.find('.select-header')
    await header.trigger('click')
    component.vm.users = users
    await component.setProps({ selected_users: [users[0]] })
    const user = component.find('.user-button')
    expect(user.find('#Checkbox').exists()).toBe(true)
  })

  it('opens and closes the select window when clicked', async () => {
    const header = component.find('.select-header')
    await header.trigger('click')
    expect(component.find('.select-window').exists()).toBe(true)

    await header.trigger('click')
    expect(component.find('.select-window').exists()).toBe(false)
  })

  it('filters users based on query', async () => {
    const query = 'user'
    vi.spyOn(UserService, 'GetUsers').mockResolvedValue({ data: users, status: 200 })
    vi.useFakeTimers()

    const header = component.find('.select-header')
    await header.trigger('click')
    expect(component.findAll('.user-button').length).toBe(0)

    // without ignore_self
    const searchBar = component.find('.search')
    await searchBar.setValue(query)
    vi.runAllTimers()
    await flushPromises()
    const filtered = component.findAll('.user-button')
    expect(filtered).toHaveLength(users.length)
    expect(filtered[0].text()).toContain(query)

    // with ignore_self
    await component.setProps({ ignore_self: true })
    await searchBar.setValue(query.slice(0, -1))
    vi.runAllTimers()
    await flushPromises()
    const filtered2 = component.findAll('.user-button')
    expect(filtered2).toHaveLength(users.length - 1)
    expect(filtered2[0].text()).toContain(query)

    // handle error
    vi.spyOn(UserService, 'GetUsers').mockRejectedValueOnce(new Error())
    await searchBar.setValue(query.slice(0, -2))
    vi.runAllTimers()
    await flushPromises()
    expect(NotificationStore.AddNotification).toHaveBeenCalled()
  })

  it('emits userSelected event when a user is clicked', async () => {
    const header = component.find('.select-header')
    component.vm.users = users
    await header.trigger('click')
    const user = component.findAll('.user-button').at(1)
    await user.trigger('click')
    expect(component.emitted().userSelected[0]).toEqual([users[1]])
  })

  it('closes the select window when clicking outside', async () => {
    const header = component.find('.select-header')
    await header.trigger('click')
    expect(component.find('.select-window').exists()).toBe(true)
    await window.dispatchEvent(new Event('click'))
    expect(component.find('.select-window').exists()).toBe(false)
  })
})
