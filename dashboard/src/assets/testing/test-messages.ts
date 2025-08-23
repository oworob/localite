import type { IApiMessage } from '@/models/user/message'

export const messages: IApiMessage[] = [
  {
    id: 1,
    created_at: new Date(),
    user_id: 1,
    content: 'Message with a project link.',
    read: false,
    link: '/projects/1',
  },
  {
    id: 2,
    created_at: new Date(),
    user_id: 1,
    content: 'Message without a link.',
    read: true,
    link: '',
  },
]
