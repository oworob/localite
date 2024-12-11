import BaseService from './BaseService'
import type { IApiResponse } from '@/models/system/api-response'
import type IApiLanguage from '@/models/project/language'

class LanguageService extends BaseService {
  constructor() {
    super('/languages')
  }

  GetLanguages(follow?: string[]): Promise<IApiResponse<IApiLanguage[]>> {
    return this.get_all(follow)
  }

  GetLanguage(id: number, follow?: string[]): Promise<IApiResponse<IApiLanguage>> {
    return this.get_one(id, follow)
  }
}

export default new LanguageService()
