import type { IApiResponse } from '@/models/system/api-response'
import type { IApiMessage } from '@/models/user/message'
import BaseService from './BaseService'

class MessageService extends BaseService {
  constructor() {
    super('/messages')
  }

  GetMessages(follow?: string[]): Promise<IApiResponse<IApiMessage[]>> {
    return this.ApiClient.get(this.url, { params: { follow } })
  }

  MarkMessageAsRead(id: number): Promise<IApiResponse<null>> {
    return this.ApiClient.patch(`${this.url}/${id}`)
  }

  DeleteMessage(id: number): Promise<IApiResponse<null>> {
    return this.ApiClient.delete(`${this.url}/${id}`)
  }
}

export default new MessageService()
