export interface IProjectSettings {
  selected_language_id?: number
  selected_entry_id?: number
  show_notes: boolean
  unfinished_translations?: IUnfinishedTranslation[]
}

export interface IUnfinishedTranslation {
  entry_id: number
  language_id: number
  content: string
}
