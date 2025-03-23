import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { users } from '@/assets/testing/test-users'
import AuthService from '../AuthService'

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        get: vi.fn(),
        post: vi.fn(),
      })),
    },
  }
})

describe('AuthService', () => {
  let mock_get: any
  let mock_post: any

  beforeEach(() => {
    mock_get = vi.spyOn(AuthService['ApiClient'], 'get')
    mock_post = vi.spyOn(AuthService['ApiClient'], 'post')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches current user', async () => {
    mock_get.mockResolvedValueOnce(users[0])
    const result = await AuthService.GetCurrentUser()
    expect(result).toEqual(users[0])
  })

  it('logs in a user', async () => {
    mock_post.mockResolvedValueOnce(users[0])
    const result = await AuthService.Login('username', 'password')
    expect(result).toEqual(users[0])
  })

  it('registers a user', async () => {
    mock_post.mockResolvedValueOnce(users[0])
    const result = await AuthService.Register('email', 'username', 'password')
    expect(result).toEqual(users[0])
  })

  it('logs out a user', async () => {
    mock_post.mockResolvedValueOnce({ status: 200 })
    const result = await AuthService.Logout()
    expect(result).toEqual({ status: 200 })
  })
})
