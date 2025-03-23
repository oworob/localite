import type { INewProjectForm } from '@/models/project/project'
import { new_entries } from './test-entries'
import { languages } from './test-languages'
import { users } from './test-users'

export const new_project_form: INewProjectForm = {
  title: 'Test Title',
  description: 'Test Description',
  notes: ['Test Note1', 'Test Note2'],
  source_language_id: languages[0].id,
  languages: [languages[1], languages[2]],
  contributors: [users[0], users[1]],
  entries: new_entries,
}
