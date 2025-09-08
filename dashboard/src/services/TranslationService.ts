import type { IApiTranslation, INewTranslation } from '@/models/project/translation'
import type { IApiResponse } from '@/models/system/api-response'
import BaseService from './BaseService'

class TranslationService extends BaseService {
  constructor() {
    super('/translations')
  }

  GetEntryTranslations(
    entry_id: number,
    language_id: number,
    follow?: string[],
  ): Promise<IApiResponse<IApiTranslation[]>> {
    return this.ApiClient.get(`${this.url}/`, { params: { entry_id, language_id, follow } })
  }

  CreateTranslation(data: INewTranslation): Promise<IApiResponse<IApiTranslation>> {
    return this.ApiClient.post(`${this.url}/`, data)
  }

  DeleteTranslation(translation_id: number): Promise<IApiResponse<null>> {
    return this.ApiClient.delete(`${this.url}/${translation_id}`)
  }

  ApproveTranslation(translation_id: number): Promise<IApiResponse<null>> {
    return this.ApiClient.patch(`${this.url}/${translation_id}/approve`)
  }

  VoteForTranslation(translation_id: number, vote: -1 | 0 | 1): Promise<IApiResponse<null>> {
    return this.ApiClient.post(`${this.url}/${translation_id}/vote`, { vote })
  }
}

export default new TranslationService()
