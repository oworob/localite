import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { languages } from '@/assets/testing/test-languages'
import LanguageService from '@/services/LanguageService'

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        get: vi.fn(),
      })),
    },
  }
})

describe('LanguageService', () => {
  let mock_get: any

  beforeEach(() => {
    mock_get = vi.spyOn(LanguageService['ApiClient'], 'get')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches all languages', async () => {
    mock_get.mockResolvedValueOnce(languages)
    const result = await LanguageService.GetLanguages()
    expect(result).toEqual(languages)
  })
})
