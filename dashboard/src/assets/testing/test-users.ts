import type { IApiUser } from '@/models/user/user'

export const users: IApiUser[] = [
  {
    id: 1,
    created_at: new Date(),
    username: 'user1',
    status: 'open_to_work',
    stats: {
      created_projects: 0,
      joined_projects: 0,
      translations: 0,
    },
  },
  {
    id: 2,
    created_at: new Date(),
    username: 'user2',
    status: 'busy',
    stats: {
      created_projects: 1,
      joined_projects: 1,
      translations: 1,
    },
  },
  {
    id: 3,
    created_at: new Date(),
    username: 'user3',
    status: 'open_to_work',
    stats: {
      created_projects: 0,
      joined_projects: 0,
      translations: 0,
    },
  },
]
