import type { IApiUser } from '../user/user'
import type { IApiEntry } from './entry'
import type { IApiProject } from './project'

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
  user_upvoted: boolean
  user_downvoted: boolean
}

export interface INewTranslation {
  project_id: number
  entry_id: number
  language_id: number
  content: string
}
