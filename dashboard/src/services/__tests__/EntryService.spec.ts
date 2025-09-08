import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { entries } from '@/assets/testing/test-entries'
import EntryService from '../EntryService'

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        post: vi.fn(),
        get: vi.fn(),
      })),
    },
  }
})

describe('EntryService', () => {
  let mock_post: any
  let mock_get: any

  beforeEach(() => {
    mock_post = vi.spyOn(EntryService['ApiClient'], 'post')
    mock_get = vi.spyOn(EntryService['ApiClient'], 'get')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches project entries', async () => {
    mock_get.mockResolvedValueOnce(entries)
    const result = await EntryService.GetProjectEntries(1, 1)
    expect(result).toEqual(entries)
  })

  it('requests entry context', async () => {
    mock_post.mockResolvedValueOnce(null)
    const result = await EntryService.RequestContext(1)
    expect(result).toEqual(null)
  })
})
