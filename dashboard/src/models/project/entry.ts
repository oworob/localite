import type IApiLanguage from './language'
import type { IApiTranslation } from './translation'

export interface IApiEntry {
  id: number
  created_at: Date
  content: string
  project_id: number
  translations?: IApiTranslation[]
  languages?: IApiEntryLanguage[]
}

export interface IApiEntryLanguage extends IApiLanguage {
  status: string
  translation_count: number
}
