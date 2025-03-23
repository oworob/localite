import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { invites } from '@/assets/testing/test-invites'
import InviteService from '../InviteService'

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        get: vi.fn(),
        post: vi.fn(),
      })),
    },
  }
})

describe('InviteService', () => {
  let mock_get: any
  let mock_post: any

  beforeEach(() => {
    mock_get = vi.spyOn(InviteService['ApiClient'], 'get')
    mock_post = vi.spyOn(InviteService['ApiClient'], 'post')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches all invites', async () => {
    mock_get.mockResolvedValueOnce(invites)
    const result = await InviteService.GetInvites()
    expect(result).toEqual(invites)
  })

  it('accepts an invite', async () => {
    mock_post.mockResolvedValueOnce({ status: 200 })
    const result = await InviteService.AcceptInvite(1)
    expect(result).toEqual({ status: 200 })
  })

  it('declines an invite', async () => {
    mock_post.mockResolvedValueOnce({ status: 200 })
    const result = await InviteService.DeclineInvite(1)
    expect(result).toEqual({ status: 200 })
  })
})
