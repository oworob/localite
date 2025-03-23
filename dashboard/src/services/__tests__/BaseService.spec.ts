import { beforeEach, describe, expect, it } from 'vitest'
import BaseService from '@/services/BaseService'

class MockService extends BaseService {
  constructor() {
    super('/mock')
  }
}

describe('BaseService', () => {
  let service: MockService

  beforeEach(() => {
    service = new MockService()
  })

  it('parses follow parameters correctly', () => {
    const result = service.parse_follow(['user', 'posts'])
    expect(result).toBe('follow=user,posts')

    const result2 = service.parse_follow()
    expect(result2).toBe('')
  })

  it('parses filter parameters correctly', () => {
    const result = service.parse_filter('username')
    expect(result).toBe('filter=username')

    const result2 = service.parse_filter()
    expect(result2).toBe('')
  })
})
