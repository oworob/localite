import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { users } from '@/assets/testing/test-users'
import UserService from '../UserService'

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        get: vi.fn(),
      })),
    },
  }
})

describe('UserService', () => {
  let mock_get: any

  beforeEach(() => {
    mock_get = vi.spyOn(UserService['ApiClient'], 'get')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches all users', async () => {
    mock_get.mockResolvedValueOnce(users)
    const result = await UserService.GetUsers()
    expect(result).toEqual(users)
  })

  it('fetches one user', async () => {
    mock_get.mockResolvedValueOnce(users[0])
    const result = await UserService.GetUser(1)
    expect(result).toEqual(users[0])
  })
})
