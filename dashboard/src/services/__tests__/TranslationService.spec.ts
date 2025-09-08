import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { new_translation, translations } from '@/assets/testing/test-translations'
import TranslationService from '../TranslationService'

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

describe('TranslationService', () => {
  let mock_post: any
  let mock_get: any
  let mock_patch: any
  let mock_delete: any

  beforeEach(() => {
    mock_post = vi.spyOn(TranslationService['ApiClient'], 'post')
    mock_get = vi.spyOn(TranslationService['ApiClient'], 'get')
    mock_patch = vi.spyOn(TranslationService['ApiClient'], 'patch')
    mock_delete = vi.spyOn(TranslationService['ApiClient'], 'delete')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches entry translations for given language', async () => {
    mock_get.mockResolvedValueOnce(translations)
    const result = await TranslationService.GetEntryTranslations(1, 1)
    expect(result).toEqual(translations)
  })

  it('creates a translation', async () => {
    mock_post.mockResolvedValueOnce(translations[0])
    const result = await TranslationService.CreateTranslation(new_translation)
    expect(result).toEqual(translations[0])
  })

  it('deletes a translation', async () => {
    mock_delete.mockResolvedValueOnce(null)
    const result = await TranslationService.DeleteTranslation(1)
    expect(result).toEqual(null)
  })

  it('approves a translation', async () => {
    mock_patch.mockResolvedValueOnce(null)
    const result = await TranslationService.ApproveTranslation(1)
    expect(result).toEqual(null)
  })

  it('sends a vote for a translation', async () => {
    mock_post.mockResolvedValueOnce(null)
    const result = await TranslationService.VoteForTranslation(1, 1)
    expect(result).toEqual(null)
  })
})
