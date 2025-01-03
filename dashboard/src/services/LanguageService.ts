import type IApiLanguage from '@/models/project/language'
import type { IApiResponse } from '@/models/system/api-response'
import BaseService from './BaseService'

class LanguageService extends BaseService {
  constructor() {
    super('/languages')
  }

  GetLanguages(follow?: string[]): Promise<IApiResponse<IApiLanguage[]>> {
    return this.ApiClient.get(`${this.url}?${this.parse_follow(follow)}`)
  }

  GetLanguage(id: number, follow?: string[]): Promise<IApiResponse<IApiLanguage>> {
    return this.ApiClient.get(`${this.url}/${id}?${this.parse_follow(follow)}`)
  }
}

export default new LanguageService()
