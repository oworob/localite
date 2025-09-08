import type { IApiTranslation, INewTranslation } from '@/models/project/translation'

export const new_translation: INewTranslation = {
  project_id: 1,
  entry_id: 1,
  language_id: 1,
  content: 'Test Translation',
}

export const translations: IApiTranslation[] = [
  {
    id: 1,
    created_at: new Date(),
    approved: false,
    author_id: 1,
    content: 'Test Translation1',
    entry_id: 1,
    language_id: 1,
    project_id: 1,
    rating: 2,
    user_vote: 0,
  },
  {
    id: 2,
    created_at: new Date(),
    approved: false,
    author_id: 2,
    content: 'Test Translation2',
    entry_id: 2,
    language_id: 2,
    project_id: 2,
    rating: 1,
    user_vote: 1,
  },
  {
    id: 3,
    created_at: new Date(),
    approved: false,
    author_id: 3,
    content: 'Test Translation3',
    entry_id: 3,
    language_id: 3,
    project_id: 3,
    rating: 0,
    user_vote: 0,
  },
]
