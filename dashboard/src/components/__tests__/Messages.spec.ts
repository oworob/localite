import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { messages } from '@/assets/testing/test-messages'
import LiveService from '@/services/LiveService'
import MessageService from '@/services/MessageService'
import { useNotificationStore } from '@/stores/NotificationStore'
import Messages from '../Messages.vue'

vi.mock('socket.io-client', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { EventEmitter } = require('events')
  return {
    io: vi.fn(() => {
      const emitter = new EventEmitter()
      emitter.connect = vi.fn(() => emitter.emit('connect'))
      emitter.disconnect = vi.fn(() => emitter.emit('disconnect'))
      return emitter
    }),
  }
})

describe('Messages', () => {
  let component: any
  let NotificationStore: ReturnType<typeof useNotificationStore>
  vi.spyOn(MessageService, 'GetMessages').mockResolvedValue({ data: [...messages], status: 200 })

  beforeEach(() => {
    component = mount(Messages, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {},
          }),
          createRouter({
            history: createWebHistory(),
            routes: [{ path: '/:pathMatch(.*)', component: { template: '<div>Section</div>' } }],
          }),
        ],
      },
    })
    NotificationStore = useNotificationStore()
  })

  it('renders correctly', () => {
    expect(component).toBeTruthy()
  })

  it('opens and closes the messages window', async () => {
    const button = component.find('.toggle')
    await button.trigger('click')
    expect(component.find('.message-window').exists()).toBe(true)
    await button.trigger('click')
    expect(component.find('.message-window').exists()).toBe(false)
  })

  it('closes the select window when clicking outside', async () => {
    await component.find('.toggle').trigger('click')
    expect(component.find('.message-window').exists()).toBe(true)
    await window.dispatchEvent(new Event('click'))
    expect(component.find('.message-window').exists()).toBe(false)
  })

  it('fetches messages on mount', () => {
    expect(component.vm.messages).toEqual(messages)
  })

  it('shows a message when there are no messages', async () => {
    component.vm.messages = []
    await component.find('.toggle').trigger('click')
    expect(component.find('.no-messages').exists()).toBe(true)
  })

  it('marks a message as read', async () => {
    vi.spyOn(MessageService, 'MarkMessageAsRead').mockResolvedValueOnce({ data: null, status: 200 })

    await component.find('.toggle').trigger('click')
    const link = component.findAll('.message').at(0)
    await link.find('.main').trigger('click')
    expect(MessageService.MarkMessageAsRead).toHaveBeenCalledWith(messages[0].id)
    expect(component.vm.messages[0].read).toBe(true)
    expect(component.find('.message-window').exists()).toBe(false)

    await component.find('.toggle').trigger('click')
    const no_link = component.findAll('.message').at(1)
    await no_link.find('.main').trigger('click')
    expect(MessageService.MarkMessageAsRead).toHaveBeenCalledWith(messages[1].id)
    expect(component.vm.messages[1].read).toBe(true)
    expect(component.find('.message-window').exists()).toBe(true)
  })

  it('handles errors when marking a message as read', async () => {
    vi.spyOn(MessageService, 'MarkMessageAsRead').mockRejectedValueOnce({
      response: { data: { message: 'Failed to mark message as read' } },
    })

    await component.find('.toggle').trigger('click')
    const message = component.findAll('.message').at(0)
    await message.find('.main').trigger('click')
    expect(MessageService.MarkMessageAsRead).toHaveBeenCalledWith(messages[0].id)
    expect(NotificationStore.AddNotification).toHaveBeenCalled()

    vi.spyOn(MessageService, 'MarkMessageAsRead').mockRejectedValueOnce(
      new Error('An error occurred'),
    )

    await message.find('.main').trigger('click')
    expect(MessageService.MarkMessageAsRead).toHaveBeenCalledWith(messages[0].id)
    expect(NotificationStore.AddNotification).toHaveBeenCalled()
  })

  it('deletes a message', async () => {
    vi.spyOn(MessageService, 'DeleteMessage').mockResolvedValueOnce({ data: null, status: 200 })

    await component.find('.toggle').trigger('click')
    const message = component.findAll('.message').at(0)
    await message.find('.delete').trigger('click')
    expect(MessageService.DeleteMessage).toHaveBeenCalledWith(messages[0].id)
    expect(component.vm.messages.length).toBe(messages.length - 1)
  })

  it('handles errors when deleting a message', async () => {
    vi.spyOn(MessageService, 'DeleteMessage').mockRejectedValueOnce({
      response: { data: { message: 'Failed to delete message' } },
    })

    await component.find('.toggle').trigger('click')
    const message = component.findAll('.message').at(0)
    await message.find('.delete').trigger('click')
    expect(MessageService.DeleteMessage).toHaveBeenCalledWith(messages[0].id)
    expect(NotificationStore.AddNotification).toHaveBeenCalled()

    vi.spyOn(MessageService, 'DeleteMessage').mockRejectedValueOnce(new Error('An error occurred'))

    await message.find('.delete').trigger('click')
    expect(MessageService.DeleteMessage).toHaveBeenCalledWith(messages[0].id)
    expect(NotificationStore.AddNotification).toHaveBeenCalled()
  })

  it('receives new messages via LiveService', () => {
    const new_message = {
      id: 3,
      content: 'New message',
      link: '/link',
      read: false,
      created_at: new Date().toISOString(),
    }

    LiveService.connect()
    expect(LiveService.connected.value).toBe(true)
    LiveService.socket.emit('new_message', new_message)
    expect(component.vm.messages.length).toBe(messages.length + 1)
  })

  afterEach(() => {
    LiveService.socket.removeAllListeners('new_message')
  })
})
