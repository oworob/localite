import type { IApiInvite } from '@/models/project/invite'
import type { IApiResponse } from '@/models/system/api-response'
import BaseService from './BaseService'

class InviteService extends BaseService {
  constructor() {
    super('/invites')
  }

  GetInvites(follow?: string[]): Promise<IApiResponse<IApiInvite[]>> {
    return this.ApiClient.get(this.url, { params: { follow } })
  }

  AcceptInvite(id: number): Promise<IApiResponse<any>> {
    return this.ApiClient.post(`${this.url}/${id}/accept`)
  }

  DeclineInvite(id: number): Promise<IApiResponse<any>> {
    return this.ApiClient.post(`${this.url}/${id}/decline`)
  }
}

export default new InviteService()
