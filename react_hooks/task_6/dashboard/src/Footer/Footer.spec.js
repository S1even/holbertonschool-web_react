import { render, screen } from '@testing-library/react'
import Footer from './Footer'
import { getFooterCopy } from '../utils/utils'

// The user now comes from App through the `user` prop.
const renderWithUser = (user) => render(<Footer user={user} />)

describe('Footer', () => {
  test('getFooterCopy returns the index copy when isIndex is true', () => {
    expect(getFooterCopy(true)).toMatch(/^holberton school$/i)
  })

  test('renders a p element with the copyright, the current year and the dashboard copy', () => {
    const { container } = render(<Footer />)
    // The copyright stays the first paragraph, whatever the context holds.
    const paragraph = container.querySelector('p')

    expect(paragraph).toBeInTheDocument()
    // The year is matched as 4 digits rather than compared to new Date(), so the
    // test does not break on New Year's Eve nor on a hardcoded reference year.
    // Anchored at the end so the index copy, which stops at "Holberton School",
    // does not satisfy the assertion.
    expect(paragraph.textContent.trim()).toMatch(
      /^copyright\s+\d{4}\s*-\s*holberton school main dashboard$/i
    )
  })

  describe('the Contact us link', () => {
    test('is not displayed without a user prop', () => {
      render(<Footer />)

      expect(screen.queryByText(/contact us/i)).not.toBeInTheDocument()
    })

    test('is not displayed when the user is logged out', () => {
      renderWithUser({ email: '', password: '', isLoggedIn: false })

      expect(screen.queryByText(/contact us/i)).not.toBeInTheDocument()
    })

    test('is displayed when the user is logged in', () => {
      renderWithUser({
        email: 'user@example.com',
        password: 'secret-password',
        isLoggedIn: true,
      })

      const link = screen.getByRole('link', { name: /contact us/i })
      expect(link).toBeInTheDocument()
      expect(link.closest('p')).toBeInTheDocument()
    })

    test('disappears once the user prop switches to logged out', () => {
      const { rerender } = renderWithUser({
        email: 'user@example.com',
        password: 'secret-password',
        isLoggedIn: true,
      })

      rerender(
        <Footer user={{ email: '', password: '', isLoggedIn: false }} />
      )

      expect(screen.queryByText(/contact us/i)).not.toBeInTheDocument()
    })
  })
})
