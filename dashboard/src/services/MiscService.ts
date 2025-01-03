import type { IApiResponse } from '@/models/system/api-response'
import type { IApiAppStats } from '@/models/system/app-stats'
import BaseService from './BaseService'

class MiscService extends BaseService {
  constructor() {
    super('/misc')
  }

  GetAppSummary(): Promise<IApiResponse<IApiAppStats>> {
    return this.ApiClient.get(`${this.url}/app_stats`)
  }
}

export default new MiscService()
