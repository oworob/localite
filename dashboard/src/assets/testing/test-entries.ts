import type { INewEntry } from '@/models/project/entry'

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
