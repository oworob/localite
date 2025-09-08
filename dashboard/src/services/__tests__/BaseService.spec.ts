import { describe, expect, it } from 'vitest'
import { serializer } from '@/services/BaseService'

describe('BaseService', () => {
  it('correctly formats array params', () => {
    expect(serializer({ follow: ['a', 'b'] })).toBe('follow=a%2Cb')
  })
})
