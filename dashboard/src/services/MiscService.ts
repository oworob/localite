import ApiClient from './ApiClient'
import type { IApiAppStats } from '@/models/system/app-stats'
import type { IApiResponse } from '@/models/system/api-response'

class MiscService {
  protected url = '/misc'

  GetAppSummary(): Promise<IApiResponse<IApiAppStats>> {
    return ApiClient.get(`${this.url}/app_stats`)
  }
}

export default new MiscService()
