import BaseService from './BaseService'
import type { IApiResponse } from '@/models/system/api-response'
import type { IApiUser } from '@/models/user/user'

class AuthService extends BaseService {
  constructor() {
    super('/auth')
  }

  Login(username: string, password: string): Promise<IApiResponse<IApiUser>> {
    return this.ApiClient.post(`${this.url}/login`, { username, password })
  }

  Register(email: string, username: string, password: string): Promise<IApiResponse<IApiUser>> {
    return this.ApiClient.post(`${this.url}/register`, { email, username, password })
  }

  GetCurrentUser(): Promise<IApiResponse<IApiUser>> {
    return this.ApiClient.get(`${this.url}/current_user`)
  }

  Logout(): Promise<IApiResponse<any>[]> {
    return this.ApiClient.post(`${this.url}/logout`)
  }
}

export default new AuthService()
