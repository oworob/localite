import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { app_stats } from '@/assets/testing/test-app-stats'
import MiscService from '../MiscService'

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        get: vi.fn(),
      })),
    },
  }
})

describe('MiscService', () => {
  let mock_get: any

  beforeEach(() => {
    mock_get = vi.spyOn(MiscService['ApiClient'], 'get')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches app stats', async () => {
    mock_get.mockResolvedValueOnce(app_stats)
    const result = await MiscService.GetAppStats()
    expect(result).toEqual(app_stats)
  })
})
