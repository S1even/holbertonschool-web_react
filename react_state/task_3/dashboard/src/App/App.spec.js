import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  let alertSpy

  beforeEach(() => {
    // jsdom has no alert, so the spy needs an implementation to stand in for it.
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    // WithLogging logs every mount and unmount of the Login form.
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // App no longer takes isLoggedIn as a prop: logging in goes through the form,
  // exactly as a visitor would.
  const logIn = async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i), 'secret-password')
    await user.click(screen.getByRole('button', { name: /^ok$/i }))
  }

  test('renders an h1 with the text School dashboard', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: /school dashboard/i })
    ).toBeInTheDocument()
  })

  test('renders an img element', () => {
    render(<App />)

    expect(screen.getByAltText(/holberton logo/i)).toBeInTheDocument()
  })

  test('renders the News from the School section by default', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /news from the school/i })
    ).toBeInTheDocument()
    // Le texte de cette section est le Lorem ipsum imposé par l'énoncé pour
    // éprouver le retour à la ligne ; on n'en vérifie qu'un fragment stable.
    expect(
      screen.getByText(/lorem ipsum dolor sit amet/i)
    ).toBeInTheDocument()
  })

  test('wraps the Login form in a body section titled Log in to continue', () => {
    const { container } = render(<App />)

    expect(
      screen.getByRole('heading', { name: /log in to continue/i })
    ).toBeInTheDocument()
    expect(
      container.querySelectorAll('.bodySectionWithMargin')
    ).not.toHaveLength(0)
  })

  test('renders the Login form until the user logs in', () => {
    const { container } = render(<App />)

    expect(
      screen.getByText(/login to access the full dashboard/i)
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^ok$/i })).toBeInTheDocument()
    expect(container.querySelector('#CourseList')).not.toBeInTheDocument()
  })

  test('renders the CourseList in place of the Login form once logged in', async () => {
    const { container } = render(<App />)

    await logIn()

    expect(container.querySelector('#CourseList')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /course list/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/available courses/i)).toBeInTheDocument()
    expect(
      screen.queryByText(/login to access the full dashboard/i)
    ).not.toBeInTheDocument()
  })

  test('wraps the CourseList in a body section titled Course list', async () => {
    const { container } = render(<App />)

    await logIn()

    // The section holding the table is the one carrying the bottom margin.
    const wrapper = container
      .querySelector('#CourseList')
      .closest('.bodySectionWithMargin')
    expect(wrapper).toBeInTheDocument()
  })

  // The drawer state lives in App, so the whole open/close round trip is
  // checked through the rendered page.
  test('opens the notifications drawer when Your notifications is clicked', () => {
    render(<App />)

    fireEvent.click(screen.getByText(/your notifications/i))

    expect(
      screen.getByText(/here is the list of notifications/i)
    ).toBeInTheDocument()
  })

  test('closes the notifications drawer when the close button is clicked', () => {
    render(<App />)

    fireEvent.click(screen.getByText(/your notifications/i))
    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(
      screen.queryByText(/here is the list of notifications/i)
    ).not.toBeInTheDocument()
  })

  test('keeps the notifications drawer working once logged in', async () => {
    render(<App />)

    await logIn()
    fireEvent.click(screen.getByText(/your notifications/i))

    expect(
      screen.getByText(/here is the list of notifications/i)
    ).toBeInTheDocument()
  })

  // The user lives in App's state and reaches the Header through the context:
  // logging in and out must show up in both places at once.
  describe('the logout section of the Header', () => {
    test('is not rendered before logging in', () => {
      const { container } = render(<App />)

      expect(container.querySelector('#logoutSection')).toBeNull()
    })

    test('welcomes the user by email once logged in', async () => {
      const { container } = render(<App />)

      await logIn()

      expect(container.querySelector('#logoutSection')).toHaveTextContent(
        /welcome user@example\.com/i
      )
    })

    test('logs the user out when logout is clicked', async () => {
      const { container } = render(<App />)
      await logIn()

      fireEvent.click(screen.getByText(/^logout$/i))

      expect(container.querySelector('#logoutSection')).toBeNull()
      expect(container.querySelector('#CourseList')).not.toBeInTheDocument()
      expect(
        screen.getByText(/login to access the full dashboard/i)
      ).toBeInTheDocument()
    })

    test('starts the Login form empty again after logging out', async () => {
      render(<App />)
      await logIn()

      fireEvent.click(screen.getByText(/^logout$/i))

      expect(screen.getByLabelText(/email/i)).toHaveValue('')
      expect(screen.getByLabelText(/password/i)).toHaveValue('')
      expect(screen.getByRole('button', { name: /^ok$/i })).toBeDisabled()
    })
  })

  // Control held down, h pressed and released, control released — a real key
  // sequence. The fallback runs only while nothing has reacted yet, so the
  // handler is never triggered twice.
  const pressCtrlH = async () => {
    await userEvent.setup().keyboard('{Control>}h{/Control}')
    if (alertSpy.mock.calls.length > 0) return

    // userEvent leaves the deprecated keyCode unset, so a handler reading it needs this.
    const init = { key: 'h', code: 'KeyH', keyCode: 72, which: 72, ctrlKey: true }
    fireEvent.keyDown(document.body, init)
  }

  test('alerts with the string Logging you out when ctrl and h are pressed', async () => {
    render(<App />)

    await pressCtrlH()

    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringMatching(/logging you out/i)
    )
  })

  test('logs the user out when ctrl and h are pressed', async () => {
    const { container } = render(<App />)
    await logIn()

    await pressCtrlH()

    expect(container.querySelector('#CourseList')).not.toBeInTheDocument()
    expect(
      screen.getByText(/login to access the full dashboard/i)
    ).toBeInTheDocument()
  })
})
