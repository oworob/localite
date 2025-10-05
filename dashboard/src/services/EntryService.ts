import type { IApiEntry, INewEntry } from '@/models/project/entry'
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

  AddEntry(project_id: number, data: INewEntry): Promise<IApiResponse<null>> {
    return this.ApiClient.post(`${this.url}/`, { project_id, ...data })
  }

  UpdateEntry(entry_id: number, data: INewEntry): Promise<IApiResponse<null>> {
    return this.ApiClient.patch(`${this.url}/${entry_id}`, data)
  }

  DeleteEntry(entry_id: number): Promise<IApiResponse<null>> {
    return this.ApiClient.delete(`${this.url}/${entry_id}`)
  }

  RequestContext(entry_id: number): Promise<IApiResponse<null>> {
    return this.ApiClient.post(`${this.url}/${entry_id}/context`)
  }
}

export default new EntryService()
