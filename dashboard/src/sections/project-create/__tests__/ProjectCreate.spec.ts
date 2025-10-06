import { createTestingPinia } from '@pinia/testing'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { new_entries } from '@/assets/testing/test-entries'
import { languages } from '@/assets/testing/test-languages'
import { new_project_form } from '@/assets/testing/test-projects'
import { users } from '@/assets/testing/test-users'
import LanguageService from '@/services/LanguageService'
import ProjectService from '@/services/ProjectService'
import { useNotificationStore } from '@/stores/NotificationStore'
import ProjectCreate from '../ProjectCreate.vue'

describe('ProjectCreate', () => {
  let component: any
  let NotificationStore: ReturnType<typeof useNotificationStore>
  vi.spyOn(LanguageService, 'GetLanguages').mockResolvedValue({ data: languages, status: 200 })

  beforeEach(() => {
    component = mount(ProjectCreate, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
          createRouter({
            history: createWebHistory(),
            routes: [
              { path: '/', component: ProjectCreate },
              { path: '/projects/:id', component: { template: '<div>Project</div>' } },
              { path: '/users/:id', component: { template: '<div>Users</div>' } },
            ],
          }),
        ],
      },
    })
    NotificationStore = useNotificationStore()
  })

  it('renders correctly', () => {
    expect(component).toBeTruthy()
  })

  it('fetches languages on mount', () => {
    expect(component.vm.languages).toEqual(languages)
  })

  it('handles errors when fetching languages', async () => {
    vi.spyOn(LanguageService, 'GetLanguages').mockRejectedValueOnce({
      response: { data: { message: 'Failed to fetch languages' } },
    })
    await component.vm.FetchData()
    expect(component.vm.error).toBe('Failed to fetch languages')

    vi.spyOn(LanguageService, 'GetLanguages').mockRejectedValueOnce(new Error('An error occurred'))
    await component.vm.FetchData()
    expect(component.vm.error).toBe('An error occurred')
  })

  it('submits the form', async () => {
    vi.spyOn(ProjectService, 'CreateProject').mockResolvedValueOnce({ data: 1, status: 200 })
    component.vm.project_form = new_project_form

    await flushPromises()
    expect(component.find('.submit-button').element.disabled).toBe(false)
    await component.find('form').trigger('submit.prevent')

    expect(ProjectService.CreateProject).toHaveBeenCalled()
    expect(NotificationStore.AddNotification).toHaveBeenCalled()
  })

  it('handles errors when submitting the form', async () => {
    vi.spyOn(ProjectService, 'CreateProject').mockRejectedValueOnce({
      response: { data: { message: 'Failed to create new project' } },
    })
    component.vm.project_form = new_project_form

    await flushPromises()
    await component.find('form').trigger('submit.prevent')
    expect(NotificationStore.AddNotification).toHaveBeenCalled()

    vi.spyOn(ProjectService, 'CreateProject').mockRejectedValueOnce(new Error('An error occurred'))

    await component.find('form').trigger('submit.prevent')
    expect(NotificationStore.AddNotification).toHaveBeenCalled()
  })

  it('updates the title and description value', async () => {
    await component.find('.title-input').setValue(new_project_form.title)
    expect(component.vm.project_form.title).toBe(new_project_form.title)

    await component.find('.description-input').setValue(new_project_form.description)
    expect(component.vm.project_form.description).toBe(new_project_form.description)
  })

  it('opens and closes notes tab', async () => {
    await component.find('.toggle-notes').trigger('click')
    expect(component.find('.notes').exists()).toBe(false)

    await component.find('.toggle-notes').trigger('click')
    expect(component.find('.notes').exists()).toBe(true)
  })

  it('adds, updates and removes notes', async () => {
    await component.find('.toggle-notes').trigger('click')
    await component.find('.add-note').trigger('click')
    expect(component.vm.project_form.notes).toHaveLength(1)

    await component.find('.note-input').setValue('Updated note')

    expect(component.vm.project_form.notes[0]).toBe('Updated note')

    await component.find('.delete-note').trigger('click')
    expect(component.vm.project_form.notes).toHaveLength(0)
    expect(component.find('.note-input').exists()).toBe(false)
  })

  it('does not add a note if the limit is reached', async () => {
    component.vm.project_form.notes = ['Note 1', 'Note 2', 'Note 3', 'Note 4', 'Note 5']
    await component.find('.add-note').trigger('click')
    expect(component.vm.project_form.notes).toHaveLength(5)
  })

  it('opens and closes target languages tab', async () => {
    await component.find('.toggle-languages').trigger('click')
    expect(component.find('.selected-languages').exists()).toBe(false)

    await component.find('.toggle-languages').trigger('click')
    expect(component.find('.selected-languages').exists()).toBe(true)
  })

  it('changes source language', () => {
    component.vm.project_form.languages = new_project_form.languages
    component.vm.HandleSourceLanguageSelected(languages[0].id)
    expect(component.vm.project_form.source_language_id).toEqual(languages[0].id)
    expect(component.vm.project_form.languages).not.toContain(languages[0])
  })

  it('selects and unselects target language', () => {
    component.vm.HandleTargetLanguageSelected(languages[1].id)
    expect(component.vm.project_form.languages[0]).toEqual(languages[1])

    component.vm.HandleTargetLanguageSelected(languages[1].id)
    expect(component.vm.project_form.languages).toHaveLength(0)
  })

  it('deletes target language', async () => {
    component.vm.project_form.languages = new_project_form.languages
    await flushPromises()
    await component.find('.delete-language').trigger('click')
    expect(component.vm.project_form.languages).toHaveLength(new_project_form.languages.length - 1)
  })

  it('opens and closes users tab', async () => {
    await component.find('.toggle-users').trigger('click')
    expect(component.find('.selected-users').exists()).toBe(false)

    await component.find('.toggle-users').trigger('click')
    expect(component.find('.selected-users').exists()).toBe(true)
  })

  it('selects and unselects users', () => {
    component.vm.HandleUserSelected(users[0])
    expect(component.vm.project_form.contributors[0].id).toBe(1)

    component.vm.HandleUserSelected(users[1])
    expect(component.vm.project_form.contributors).toHaveLength(2)

    component.vm.HandleUserSelected(users[0])
    expect(component.vm.project_form.contributors).toHaveLength(1)
  })

  it('deletes user', async () => {
    component.vm.project_form.contributors = users
    await flushPromises()
    await component.find('.delete-user').trigger('click')
    expect(component.vm.project_form.contributors).toHaveLength(users.length - 1)
  })

  it('opens and closes entries tab', async () => {
    await component.find('.toggle-entries').trigger('click')
    expect(component.find('.entries').exists()).toBe(false)

    await component.find('.toggle-entries').trigger('click')
    expect(component.find('.entries').exists()).toBe(true)
  })

  it('adds, updates and removes entries', async () => {
    await component.find('.entry-content').setValue('Updated content')
    expect(component.vm.project_form.entries[0].content).toBe('Updated content')

    await component.find('.entry-context').setValue('Updated context')
    expect(component.vm.project_form.entries[0].context).toBe('Updated context')

    await component.find('.add-entry').trigger('click')
    expect(component.vm.project_form.entries).toHaveLength(2)

    await component.find('.delete-entry').trigger('click')
    expect(component.vm.project_form.entries).toHaveLength(1)
  })

  it('opens and closes import tab', async () => {
    await component.find('.open-import').trigger('click')
    expect(component.find('#ImportEntries').exists()).toBe(true)

    await component.find('#ImportEntries .cancel').trigger('click')
    expect(component.find('#ImportEntries').exists()).toBe(false)
  })

  it('imports and overwrites entries from CSV', async () => {
    await component.find('.open-import').trigger('click')
    expect(component.find('#ImportEntries').exists()).toBe(true)

    const import_component = component.findComponent({ name: 'ImportEntries' })
    await import_component.vm.$emit('saveEntries', new_entries, 'overwrite')
    expect(component.vm.project_form.entries).toEqual(new_entries)
  })

  it('imports and appends entries from CSV', async () => {
    component.vm.project_form.entries = new_entries
    await component.find('.open-import').trigger('click')
    expect(component.find('#ImportEntries').exists()).toBe(true)

    const import_component = component.findComponent({ name: 'ImportEntries' })
    await import_component.vm.$emit('saveEntries', new_entries, 'append')
    expect(component.vm.project_form.entries).toEqual([...new_entries, ...new_entries])
  })
})
