import { fireEvent, render, screen } from '@testing-library/react'
import Header from './Header'

const loggedOutUser = { email: '', password: '', isLoggedIn: false }

const loggedInUser = {
  email: 'user@example.com',
  password: 'secret-password',
  isLoggedIn: true,
}

// Renders the Header with the props App passes once a user has logged in.
const renderLoggedIn = (logOut = () => {}) =>
  render(<Header user={loggedInUser} logOut={logOut} />)

describe('Header', () => {
  test('is a function component', () => {
    expect(typeof Header).toBe('function')
    expect(Header.prototype?.isReactComponent).toBeUndefined()
  })

  test('renders the Holberton logo', () => {
    const { container } = render(<Header user={loggedOutUser} logOut={() => {}} />)
    const images = Array.from(container.querySelectorAll('img'))

    // The logo is identified by its alt text or its source, so the assertion
    // survives a component that words the alt attribute differently.
    const logo = images.find((image) =>
      /holberton/i.test(`${image.getAttribute('alt')} ${image.getAttribute('src')}`)
    )

    expect(logo).toBeDefined()
    expect(logo).toBeInTheDocument()
  })

  test('renders an h1 with the text School dashboard', () => {
    render(<Header user={loggedOutUser} logOut={() => {}} />)

    expect(
      screen.getByRole('heading', { level: 1, name: /school dashboard/i })
    ).toBeInTheDocument()
  })

  describe('the logout section', () => {
    test('is not rendered while the user is logged out', () => {
      const { container } = render(<Header user={loggedOutUser} logOut={() => {}} />)

      expect(container.querySelector('#logoutSection')).toBeNull()
    })

    test('is rendered when the user in the context is logged in', () => {
      const { container } = renderLoggedIn()
      const section = container.querySelector('#logoutSection')

      expect(section).toBeInTheDocument()
      expect(section).toHaveTextContent(/welcome user@example\.com/i)
      expect(screen.getByText(/^logout$/i)).toBeInTheDocument()
    })

    test('calls the logOut function of the context when logout is clicked', () => {
      const logOut = jest.fn()
      renderLoggedIn(logOut)

      fireEvent.click(screen.getByText(/^logout$/i))

      expect(logOut).toHaveBeenCalledTimes(1)
    })
  })
})

describe('Header without props', () => {
  // App always passes both props; rendering without them must still work.
  test('renders the logo and the title, without the logout section', () => {
    const { container } = render(<Header />)

    expect(
      screen.getByRole('heading', { level: 1, name: /school dashboard/i })
    ).toBeInTheDocument()
    expect(container.querySelector('#logoutSection')).toBeNull()
  })

  test('does not crash when logout is clicked without a logOut prop', () => {
    render(<Header user={loggedInUser} />)

    expect(() => fireEvent.click(screen.getByText(/^logout$/i))).not.toThrow()
  })
})
