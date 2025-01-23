import type { IApiInvite } from '@/models/project/invite'
import type { IApiProject, INewProject } from '@/models/project/project'
import type { IApiResponse } from '@/models/system/api-response'
import BaseService from './BaseService'

class ProjectService extends BaseService {
  constructor() {
    super('/projects')
  }

  GetProjects(follow?: string[]): Promise<IApiResponse<IApiProject[]>> {
    return this.ApiClient.get(`${this.url}?${this.parse_follow(follow)}`)
  }

  GetProject(id: number, follow?: string[]): Promise<IApiResponse<IApiProject>> {
    return this.ApiClient.get(`${this.url}/${id}?${this.parse_follow(follow)}`)
  }

  CreateProject(data: INewProject): Promise<IApiResponse<number>> {
    return this.ApiClient.post(`${this.url}/`, data)
  }

  GetInvites(follow?: string[]): Promise<IApiResponse<IApiInvite[]>> {
    return this.ApiClient.get(`${this.url}/invites?${this.parse_follow(follow)}`)
  }

  AcceptInvite(id: number): Promise<IApiResponse<any>> {
    return this.ApiClient.post(`${this.url}/invites/${id}/accept`)
  }

  DeclineInvite(id: number): Promise<IApiResponse<any>> {
    return this.ApiClient.post(`${this.url}/invites/${id}/decline`)
  }
}

export default new ProjectService()
