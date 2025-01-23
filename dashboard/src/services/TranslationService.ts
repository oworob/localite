import type { IApiTranslation, INewTranslation } from '@/models/project/translation'
import type { IApiResponse } from '@/models/system/api-response'
import BaseService from './BaseService'

class TranslationService extends BaseService {
  constructor() {
    super('/translations')
  }

  CreateTranslation(data: INewTranslation): Promise<IApiResponse<IApiTranslation>> {
    return this.ApiClient.post(`${this.url}/`, data)
  }
}

export default new TranslationService()
