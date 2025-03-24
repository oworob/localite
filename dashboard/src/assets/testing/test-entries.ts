import type { IApiEntry, INewEntry } from '@/models/project/entry'

export const new_entries: INewEntry[] = [
  {
    content: 'entry1',
    context: 'context1',
  },
  {
    content: 'entry2',
    context: 'context2',
  },
]

export const new_entries_csv = 'content,context\nentry1,context1\nentry2,context2\n'

export const entries: IApiEntry[] = [
  {
    id: 1,
    project_id: 1,
    created_at: new Date(),
    content: 'entry1',
    context: 'context1',
    context_requested: false,
  },
  {
    id: 2,
    project_id: 1,
    created_at: new Date(),
    content: 'entry2',
    context: 'context2',
    context_requested: false,
  },
  {
    id: 3,
    project_id: 2,
    created_at: new Date(),
    content: 'entry3',
    context: 'context3',
    context_requested: false,
  },
]
