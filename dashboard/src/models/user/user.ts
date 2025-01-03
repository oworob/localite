export interface IApiUser {
  id: number
  created_at: Date
  username: string
  status: keyof typeof UserStatus
  last_project_visit?: Date
  stats?: IApiUserStats
}

export interface IApiUserStats {
  created_projects: number
  joined_projects: number
  translations: number
}

export const UserStatus = {
  open_to_work: 'Open To Work',
  busy: 'Busy',
}
