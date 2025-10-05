import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { entries } from '@/assets/testing/test-entries'
import EntryService from '../EntryService'

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        post: vi.fn(),
        get: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
      })),
    },
  }
})

describe('EntryService', () => {
  let mock_post: any
  let mock_get: any
  let mock_patch: any
  let mock_delete: any

  beforeEach(() => {
    mock_post = vi.spyOn(EntryService['ApiClient'], 'post')
    mock_get = vi.spyOn(EntryService['ApiClient'], 'get')
    mock_patch = vi.spyOn(EntryService['ApiClient'], 'patch')
    mock_delete = vi.spyOn(EntryService['ApiClient'], 'delete')
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

  it('adds new entry', async () => {
    mock_post.mockResolvedValueOnce(null)
    const result = await EntryService.AddEntry(1, {
      content: 'Content',
      context: 'Context',
    })
    expect(result).toEqual(null)
  })

  it('updates an entry', async () => {
    mock_patch.mockResolvedValueOnce(null)
    const result = await EntryService.UpdateEntry(1, {
      content: 'Updated Content',
      context: 'Updated Context',
    })
    expect(result).toEqual(null)
  })

  it('deletes an entry', async () => {
    mock_delete.mockResolvedValueOnce(null)
    const result = await EntryService.DeleteEntry(1)
    expect(result).toEqual(null)
  })
})
