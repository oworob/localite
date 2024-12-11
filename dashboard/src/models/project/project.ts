import type { IApiEntry } from './entry'
import type IApiLanguage from './language'
import type { IApiNote } from './note'
import type { IApiUser } from '../user/user'

export interface IApiProject {
  id: number
  created_at: Date
  title: string
  owner_id: number
  owner?: IApiUser
  private: boolean
  original_language_id: number
  original_language?: IApiLanguage
  notes?: IApiNote[]
  contributors?: IApiUser[]
  entries?: IApiEntry[]
  languages?: IApiLanguage[]
}
