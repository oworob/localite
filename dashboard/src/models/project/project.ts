import type { IApiEntry, INewEntry } from './entry'
import type IApiLanguage from './language'
import type { IApiNote } from './note'
import type { IApiUser } from '../user/user'

export interface IApiProject {
  id: number
  created_at: Date
  title: string
  description: string
  owner_id: number
  owner?: IApiUser
  original_language_id: number
  original_language?: IApiLanguage
  notes?: IApiNote[]
  contributors?: IApiUser[]
  entries?: IApiEntry[]
  languages?: IApiLanguage[]
}

export interface INewProject {
  title: string
  description: string
  notes: string[]
  original_language_id: number
  languages: number[]
  contributors: number[]
  entries: INewEntry[]
}
