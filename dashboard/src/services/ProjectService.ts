import BaseService from './BaseService'
import type { IApiResponse } from '@/models/system/api-response'
import type { IApiProject } from '@/models/project/project'

class ProjectService extends BaseService {
  constructor() {
    super('/projects')
  }

  GetProjects(follow?: string[]): Promise<IApiResponse<IApiProject[]>> {
    return this.get_all(follow)
  }

  GetProject(id: number, follow?: string[]): Promise<IApiResponse<IApiProject>> {
    return this.get_one(id, follow)
  }
}

export default new ProjectService()
