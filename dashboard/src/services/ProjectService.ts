import type { IApiProject, INewProject, IProjectTitleDesc } from '@/models/project/project'
import type { IApiResponse } from '@/models/system/api-response'
import BaseService from './BaseService'

class ProjectService extends BaseService {
  constructor() {
    super('/projects')
  }

  GetProjects(follow?: string[]): Promise<IApiResponse<IApiProject[]>> {
    return this.ApiClient.get(this.url, { params: { follow } })
  }

  GetProject(id: number, follow?: string[]): Promise<IApiResponse<IApiProject>> {
    return this.ApiClient.get(`${this.url}/${id}`, { params: { follow } })
  }

  CreateProject(data: INewProject): Promise<IApiResponse<number>> {
    return this.ApiClient.post(`${this.url}/`, data)
  }

  LeaveProject(id: number): Promise<IApiResponse<null>> {
    return this.ApiClient.delete(`${this.url}/${id}/leave`)
  }

  UpdateProjectDetails(id: number, data: IProjectTitleDesc): Promise<IApiResponse<null>> {
    return this.ApiClient.patch(`${this.url}/${id}/details`, data)
  }

  UpdateProjectNotes(id: number, data: string[]): Promise<IApiResponse<null>> {
    return this.ApiClient.patch(`${this.url}/${id}/notes`, data)
  }

  DeleteProject(id: number): Promise<IApiResponse<null>> {
    return this.ApiClient.delete(`${this.url}/${id}`)
  }
}

export default new ProjectService()
