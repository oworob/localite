import { describe, expect, it } from 'vitest'
import { FormatDate } from '../FormatDate'

describe('FormatDate', () => {
  it('formats date correctly without showing month', () => {
    const date = new Date('2023-10-15')
    const formattedDate = FormatDate(date)
    expect(formattedDate).toBe('15-10-2023')
  })

  it('formats date correctly with showing month', () => {
    const date = new Date('2023-10-15')
    const formattedDate = FormatDate(date, true)
    expect(formattedDate).toBe('15th October 2023')
  })

  it('formats date correctly with suffix for 1st', () => {
    const date = new Date('2023-10-01')
    const formattedDate = FormatDate(date, true)
    expect(formattedDate).toBe('1st October 2023')
  })

  it('formats date correctly with suffix for 2nd', () => {
    const date = new Date('2023-10-02')
    const formattedDate = FormatDate(date, true)
    expect(formattedDate).toBe('2nd October 2023')
  })

  it('formats date correctly with suffix for 3rd', () => {
    const date = new Date('2023-10-03')
    const formattedDate = FormatDate(date, true)
    expect(formattedDate).toBe('3rd October 2023')
  })

  it('formats date correctly with suffix for 4th', () => {
    const date = new Date('2023-10-24')
    const formattedDate = FormatDate(date, true)
    expect(formattedDate).toBe('24th October 2023')
  })
})
