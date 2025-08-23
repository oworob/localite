import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { messages } from '@/assets/testing/test-messages'
import MessageService from '../MessageService'

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        get: vi.fn(),
        delete: vi.fn(),
        patch: vi.fn(),
      })),
    },
  }
})

describe('MessageService', () => {
  let mock_get: any
  let mock_delete: any
  let mock_patch: any

  beforeEach(() => {
    mock_get = vi.spyOn(MessageService['ApiClient'], 'get')
    mock_delete = vi.spyOn(MessageService['ApiClient'], 'delete')
    mock_patch = vi.spyOn(MessageService['ApiClient'], 'patch')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches all messages', async () => {
    mock_get.mockResolvedValueOnce(messages)
    const result = await MessageService.GetMessages()
    expect(result).toEqual(messages)
  })

  it('marks message as read', async () => {
    mock_patch.mockResolvedValueOnce(null)
    const result = await MessageService.MarkMessageAsRead(1)
    expect(result).toEqual(null)
  })

  it('deletes a message', async () => {
    mock_delete.mockResolvedValueOnce(null)
    const result = await MessageService.DeleteMessage(1)
    expect(result).toEqual(null)
  })
})
