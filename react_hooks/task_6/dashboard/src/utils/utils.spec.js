import { getCurrentYear, getFooterCopy, getLatestNotification } from './utils'

describe('getCurrentYear', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  // Freezing the clock avoids a time bomb: hardcoding a year would make the
  // suite fail on 1 January, and comparing against new Date() would only
  // restate the implementation.
  test('returns the year of the system clock', () => {
    jest.useFakeTimers().setSystemTime(new Date(2020, 5, 15))

    expect(getCurrentYear()).toBe(2020)
  })

  test('follows the system clock when the year changes', () => {
    jest.useFakeTimers().setSystemTime(new Date(2031, 5, 15))

    expect(getCurrentYear()).toBe(2031)
  })
})

describe('getFooterCopy', () => {
  test('returns Holberton School when isIndex is true', () => {
    expect(getFooterCopy(true)).toMatch(/^holberton school$/i)
  })

  test('returns Holberton School main dashboard when isIndex is false', () => {
    expect(getFooterCopy(false)).toMatch(/^holberton school main dashboard$/i)
  })
})

describe('getLatestNotification', () => {
  test('returns the urgent requirement markup', () => {
    expect(getLatestNotification()).toMatch(
      /^<strong>urgent requirement<\/strong>\s*-\s*complete by eod$/i
    )
  })
})
