import type IApiLanguage from '@/models/project/language'

export const languages: IApiLanguage[] = [
  { id: 1, title_eng: 'English', title_native: 'English', code: 'en', created_at: new Date() },
  { id: 2, title_eng: 'Spanish', title_native: 'Español', code: 'es', created_at: new Date() },
  { id: 3, title_eng: 'French', title_native: 'Français', code: 'fr', created_at: new Date() },
]
