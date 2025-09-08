import type { IApiEntry } from '@/models/project/entry'
import type { IApiResponse } from '@/models/system/api-response'
import BaseService from './BaseService'

class EntryService extends BaseService {
  constructor() {
    super('/entries')
  }

  GetProjectEntries(
    project_id: number,
    language_id?: number,
    follow?: string[],
  ): Promise<IApiResponse<IApiEntry[]>> {
    return this.ApiClient.get(this.url, { params: { project_id, language_id, follow } })
  }

  RequestContext(entry_id: number): Promise<IApiResponse<null>> {
    return this.ApiClient.post(`${this.url}/${entry_id}/context`)
  }
}

export default new EntryService()
