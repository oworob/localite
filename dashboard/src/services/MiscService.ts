import BaseService from './BaseService'
import type { IApiAppStats } from '@/models/system/app-stats'
import type { IApiResponse } from '@/models/system/api-response'

class MiscService extends BaseService {
  constructor() {
    super('/misc')
  }

  GetAppSummary(): Promise<IApiResponse<IApiAppStats>> {
    return this.ApiClient.get(`${this.url}/app_stats`)
  }
}

export default new MiscService()
