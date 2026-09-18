import { render } from '@testing-library/react'
import Footer from './Footer'
import { getFooterCopy } from '../utils/utils'

describe('Footer', () => {
  test('getFooterCopy returns the index copy when isIndex is true', () => {
    expect(getFooterCopy(true)).toMatch(/^holberton school$/i)
  })

  test('renders a p element with the copyright, the current year and the index copy', () => {
    const { container } = render(<Footer />)
    const paragraph = container.querySelector('p')

    expect(paragraph).toBeInTheDocument()
    // The year is matched as 4 digits rather than compared to new Date(), so the
    // test does not break on New Year's Eve nor on a hardcoded reference year.
    // Anchored at the end so getFooterCopy(false), which appends
    // "main dashboard", does not satisfy the assertion.
    expect(paragraph.textContent.trim()).toMatch(
      /^copyright\s+\d{4}\s*-\s*holberton school$/i
    )
  })
})
