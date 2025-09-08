import type { IApiInvite } from '@/models/project/invite'
import { projects } from './test-projects'

export const invites: IApiInvite[] = [
  {
    id: 1,
    created_at: new Date(),
    project_id: 1,
    user_id: 1,
    project: projects[0],
  },
  {
    id: 2,
    created_at: new Date(),
    project_id: 2,
    user_id: 2,
  },
  {
    id: 3,
    created_at: new Date(),
    project_id: 3,
    user_id: 3,
  },
]
