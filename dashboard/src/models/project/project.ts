import type { IApiUser } from '../user/user'
import type { IApiEntry, INewEntry } from './entry'
import type { IApiLanguage } from './language'
import type { IApiNote } from './note'

export interface IApiProject {
  id: number
  created_at: Date
  title: string
  description: string
  owner_id: number
  owner?: IApiUser
  source_language_id: number
  source_language?: IApiLanguage
  notes?: IApiNote[]
  contributors?: IApiUser[]
  entries?: IApiEntry[]
  languages?: IApiLanguage[]
  stats?: IApiProjectStats
}

export interface IApiProjectStats {
  languages: number
  contributors: number
  entries: number
  translations: number
  notes: number
}

export interface INewProject {
  title: string
  description: string
  notes: string[]
  source_language_id: number
  languages: number[]
  contributors: number[]
  entries: INewEntry[]
}

export interface INewProjectForm extends Omit<INewProject, 'languages' | 'contributors'> {
  languages: IApiLanguage[]
  contributors: IApiUser[]
}
