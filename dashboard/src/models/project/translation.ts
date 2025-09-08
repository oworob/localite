import type { IApiUser } from '../user/user'
import type { IApiEntry } from './entry'
import type { IApiProject } from './project'
import type { IApiVote } from './vote'

export interface IApiTranslation {
  id: number
  created_at: Date
  approved: boolean
  author_id: number
  author?: IApiUser
  content: string
  entry_id: number
  entry?: IApiEntry
  language_id: number
  project_id: number
  project?: IApiProject
  votes?: IApiVote[]
  rating: number
  user_vote: -1 | 0 | 1
}

export interface INewTranslation {
  project_id: number
  entry_id: number
  language_id: number
  content: string
}
