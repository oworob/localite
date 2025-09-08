import type { IApiLanguage } from './language'
import type { IApiTranslation } from './translation'

export interface IApiEntry {
  id: number
  created_at: Date
  content: string
  context?: string
  context_requested: boolean
  project_id: number
  translations?: IApiTranslation[]
  languages?: IApiLanguage[]
  status?: string
}

export interface INewEntry {
  content: string
  context: string
}
