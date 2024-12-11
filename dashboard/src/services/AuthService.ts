import ApiClient from './ApiClient'
import type { IApiResponse } from '@/models/system/api-response'
import type { IApiUser } from '@/models/user/user'

class AuthService {
  protected url: string
  constructor() {
    this.url = '/auth'
  }

  Login(username: string, password: string): Promise<IApiResponse<IApiUser>> {
    return ApiClient.post(`${this.url}/login`, { username, password })
  }

  Register(email: string, username: string, password: string): Promise<IApiResponse<IApiUser>> {
    return ApiClient.post(`${this.url}/register`, { email, username, password })
  }

  GetCurrentUser(): Promise<IApiResponse<IApiUser>> {
    return ApiClient.get(`${this.url}/current_user`)
  }

  Logout(): Promise<IApiResponse<any>[]> {
    return ApiClient.post(`${this.url}/logout`)
  }
}

export default new AuthService()
