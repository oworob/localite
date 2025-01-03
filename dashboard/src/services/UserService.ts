import type { IApiResponse } from '@/models/system/api-response'
import type { IApiUser } from '@/models/user/user'
import BaseService from './BaseService'

class UserService extends BaseService {
  constructor() {
    super('/users')
  }

  GetUsers(follow?: string[], filter?: string): Promise<IApiResponse<IApiUser[]>> {
    return this.ApiClient.get(
      `${this.url}?${this.parse_follow(follow)}&${this.parse_filter(filter)}`,
    )
  }

  GetUser(id: number, follow?: string[]): Promise<IApiResponse<IApiUser>> {
    return this.ApiClient.get(`${this.url}/${id}?${this.parse_follow(follow)}`)
  }
}

export default new UserService()
