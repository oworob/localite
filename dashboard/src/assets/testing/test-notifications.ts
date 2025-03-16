import type { INotification } from '@/models/system/notification'

export const notifications: INotification[] = [
  { id: 1, message: 'This is a success message', type: 'success', removing: false },
  { id: 2, message: 'This is an info message', type: 'info', removing: false },
  { id: 3, message: 'This is a warning message', type: 'warn', removing: false },
  { id: 4, message: 'This is an error message', type: 'error', removing: false },
]
