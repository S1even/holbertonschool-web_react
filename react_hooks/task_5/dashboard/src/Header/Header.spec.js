import { fireEvent, render, screen } from '@testing-library/react'
import Header from './Header'
import newContext from '../Context/context'

// Capitalised so ESLint, without a React plugin, sees its JSX usage.
const ContextProvider = newContext.Provider

const loggedInUser = {
  email: 'user@example.com',
  password: 'secret-password',
  isLoggedIn: true,
}

// Renders the Header under a Provider, as App does once a user has logged in.
const renderLoggedIn = (logOut = () => {}) =>
  render(
    <ContextProvider value={{ user: loggedInUser, logOut }}>
      <Header />
    </ContextProvider>
  )

describe('Header', () => {
  test('is a function component', () => {
    expect(typeof Header).toBe('function')
    expect(Header.prototype?.isReactComponent).toBeUndefined()
  })

  test('renders the Holberton logo', () => {
    const { container } = render(<Header />)
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
    render(<Header />)

    expect(
      screen.getByRole('heading', { level: 1, name: /school dashboard/i })
    ).toBeInTheDocument()
  })

  describe('the logout section', () => {
    test('is not rendered with the default context value', () => {
      const { container } = render(<Header />)

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
