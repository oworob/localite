export interface IApiMessage {
  id: number
  created_at: Date
  user_id: number
  content: string
  read: boolean
  link: string
}
