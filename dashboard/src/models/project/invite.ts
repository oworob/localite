import type { IApiUser } from '../user/user'
import type { IApiProject } from './project'

export interface IApiInvite {
  id: number
  created_at: Date
  project_id: number
  user_id: number
  project?: IApiProject
  user?: IApiUser
}
