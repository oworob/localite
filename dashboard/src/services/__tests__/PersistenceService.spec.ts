import { beforeEach, describe, expect, it } from 'vitest'
import PersistenceService from '../PersistenceService'

describe('PersistenceService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('sets a value', () => {
    PersistenceService.Set('key', 'value')
    expect(localStorage.getItem('key')).toBe('"value"')
  })

  it('retrieves a value by key', () => {
    localStorage.setItem('key', '"value"')
    expect(PersistenceService.Get('key')).toBe('value')
    expect(PersistenceService.Get('non-existent')).toBe(null)
  })

  it('removes a value by key', () => {
    localStorage.setItem('key', '"value"')
    PersistenceService.Remove('key')
    expect(localStorage.getItem('key')).toBe(null)
  })

  it('clears all values', () => {
    localStorage.setItem('key', '"value"')
    PersistenceService.Clear()
    expect(localStorage.getItem('key')).toBe(null)
  })
})
