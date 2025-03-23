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
    accepted: false,
    author_id: 1,
    content: 'Test Translation1',
    entry_id: 1,
    language_id: 1,
    project_id: 1,
    total_votes: 2,
    user_upvoted: true,
    user_downvoted: false,
  },
  {
    id: 2,
    created_at: new Date(),
    accepted: false,
    author_id: 2,
    content: 'Test Translation2',
    entry_id: 2,
    language_id: 2,
    project_id: 2,
    total_votes: 1,
    user_upvoted: false,
    user_downvoted: true,
  },
  {
    id: 3,
    created_at: new Date(),
    accepted: false,
    author_id: 3,
    content: 'Test Translation3',
    entry_id: 3,
    language_id: 3,
    project_id: 3,
    total_votes: 0,
    user_upvoted: false,
    user_downvoted: false,
  },
]
