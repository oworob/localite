import type { IApiUser } from '@/models/user/user'

export const users: IApiUser[] = [
  {
    id: 1,
    created_at: new Date(),
    username: 'user1',
    status: 'open_to_work',
  },
  {
    id: 2,
    created_at: new Date(),
    username: 'user2',
    status: 'busy',
  },
  {
    id: 3,
    created_at: new Date(),
    username: 'user3',
    status: 'open_to_work',
  },
]
