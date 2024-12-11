export interface INotification {
  id: number
  message: string
  type: 'success' | 'info' | 'warn' | 'error'
  removing: boolean
}
