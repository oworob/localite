import type { IApiUser } from '../user/user'
import type { IApiTranslation } from './translation'

export interface IApiVote {
  id: number
  created_at: Date
  user_id: number
  user?: IApiUser
  translation_id: number
  translation?: IApiTranslation
  is_upvote: boolean
}
