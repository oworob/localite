import type { IApiEntry } from './entry'
import type { IApiProject } from './project'
import type { IApiUser } from '../user/user'

export interface IApiTranslation {
  id: number
  created_at: Date
  accepted: boolean
  author_id: number
  author?: IApiUser
  content: string
  entry_id: number
  entry?: IApiEntry
  language_id: number
  project_id: number
  project?: IApiProject
  total_votes: number
}
