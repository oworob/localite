import type { IApiProject, INewProject, INewProjectForm } from '@/models/project/project'
import { entries, new_entries } from './test-entries'
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

export const new_project: INewProject = {
  title: new_project_form.title,
  description: new_project_form.description,
  source_language_id: new_project_form.source_language_id,
  languages: new_project_form.languages.map((lang) => lang.id),
  contributors: new_project_form.contributors.map((user) => user.id),
  entries: new_entries,
  notes: new_project_form.notes,
}

export const projects: IApiProject[] = [
  {
    id: 1,
    created_at: new Date(),
    title: 'Project1',
    description: 'Description1',
    owner_id: 1,
    source_language_id: 1,
    entries: entries,
    languages: languages,
    updates: [
      {
        id: 1,
        created_at: new Date(),
        content: 'Update1',
        project_id: 1,
      },
      {
        id: 2,
        created_at: new Date(),
        content: 'Update2',
        project_id: 1,
      },
    ],
  },
  {
    id: 2,
    created_at: new Date(),
    title: 'Project2',
    description: '',
    owner_id: 2,
    source_language_id: 2,
  },
  {
    id: 3,
    created_at: new Date(),
    title: 'Project3',
    description: '',
    owner_id: 3,
    source_language_id: 3,
  },
]
