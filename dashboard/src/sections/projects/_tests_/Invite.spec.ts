import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { invites } from '@/assets/testing/test-invites'
import InviteService from '@/services/InviteService'
import { useNotificationStore } from '@/stores/NotificationStore'
import Invite from '../Invite.vue'

describe('Invite', () => {
  let component: any
  let NotificationStore: ReturnType<typeof useNotificationStore>

  beforeEach(() => {
    component = mount(Invite, {
      props: {
        invite: invites[0],
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    })
    NotificationStore = useNotificationStore()
  })

  it('renders correctly', () => {
    expect(component).toBeTruthy()
  })

  it('accepts an invite', async () => {
    vi.spyOn(InviteService, 'AcceptInvite').mockResolvedValueOnce({ data: null, status: 200 })
    const button = component.find('button.accept')
    await button.trigger('click')
    expect(InviteService.AcceptInvite).toHaveBeenCalled()
    expect(component.emitted()).toHaveProperty('accept')
  })

  it('declines an invite', async () => {
    vi.spyOn(InviteService, 'DeclineInvite').mockResolvedValueOnce({ data: null, status: 200 })
    const button = component.find('button.decline')
    await button.trigger('click')
    expect(InviteService.DeclineInvite).toHaveBeenCalled()
    expect(component.emitted()).toHaveProperty('reject')
  })

  it('handles errors when accepting an invite', async () => {
    vi.spyOn(InviteService, 'AcceptInvite').mockRejectedValueOnce(new Error('An error occured'))
    const button = component.find('button.accept')
    await button.trigger('click')
    expect(NotificationStore.AddNotification).toHaveBeenCalledWith('An error occured', 'error')

    vi.spyOn(InviteService, 'AcceptInvite').mockRejectedValueOnce({
      response: { data: { message: 'Failed to accept invite' } },
    })
    await button.trigger('click')
    expect(NotificationStore.AddNotification).toHaveBeenCalledWith(
      'Failed to accept invite',
      'error',
    )
  })

  it('handles errors when declining an invite', async () => {
    vi.spyOn(InviteService, 'DeclineInvite').mockRejectedValueOnce(new Error('An error occured'))
    const button = component.find('button.decline')
    await button.trigger('click')
    expect(NotificationStore.AddNotification).toHaveBeenCalledWith('An error occured', 'error')

    vi.spyOn(InviteService, 'DeclineInvite').mockRejectedValueOnce({
      response: { data: { message: 'Failed to decline invite' } },
    })
    await button.trigger('click')
    expect(NotificationStore.AddNotification).toHaveBeenCalledWith(
      'Failed to decline invite',
      'error',
    )
  })
})
