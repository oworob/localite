import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { new_translation, translations } from '@/assets/testing/test-translations'
import TranslationService from '../TranslationService'

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        post: vi.fn(),
      })),
    },
  }
})

describe('TranslationService', () => {
  let mock_post: any

  beforeEach(() => {
    mock_post = vi.spyOn(TranslationService['ApiClient'], 'post')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates a translation', async () => {
    mock_post.mockResolvedValueOnce(translations[0])
    const result = await TranslationService.CreateTranslation(new_translation)
    expect(result).toEqual(translations[0])
  })
})
