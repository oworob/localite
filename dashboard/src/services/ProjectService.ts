import BaseService from './BaseService'
import type { IApiResponse } from '@/models/system/api-response'
import type { IApiProject, INewProject } from '@/models/project/project'

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
}

export default new ProjectService()
