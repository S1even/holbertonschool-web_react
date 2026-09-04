import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  let alertSpy

  beforeEach(() => {
    // jsdom has no alert, so the spy needs an implementation to stand in for it.
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

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

  test('renders the Login form when isLoggedIn is false', () => {
    const { container } = render(<App isLoggedIn={false} />)

    expect(
      screen.getByText(/login to access the full dashboard/i)
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^ok$/i })).toBeInTheDocument()

    // Only the email and password fields count, not a submit/button input.
    const fields = Array.from(container.querySelectorAll('input')).filter(
      (input) => !['button', 'reset', 'submit'].includes(input.type)
    )
    expect(fields).toHaveLength(2)
  })

  test('is logged out by default, so the Login form shows without the prop', () => {
    render(<App />)

    expect(
      screen.getByText(/login to access the full dashboard/i)
    ).toBeInTheDocument()
  })

  test('renders the CourseList when isLoggedIn is true', () => {
    const { container } = render(<App isLoggedIn />)

    expect(container.querySelector('#CourseList')).toBeInTheDocument()
    expect(screen.getByText(/available courses/i)).toBeInTheDocument()
    expect(screen.getByText(/react/i)).toBeInTheDocument()
    expect(
      screen.queryByText(/login to access the full dashboard/i)
    ).not.toBeInTheDocument()
  })

  // Control held down, h pressed and released, control released — a real key sequence.
  // Each fallback below runs only while nothing has reacted yet, so the handler of a
  // component that does react is never triggered twice.
  const pressCtrlH = async (logOut) => {
    const reacted = () =>
      alertSpy.mock.calls.length > 0 || logOut.mock.calls.length > 0

    await userEvent.setup().keyboard('{Control>}h{/Control}')
    if (reacted()) return

    // userEvent leaves the deprecated keyCode unset, so a handler reading it needs this.
    const init = { key: 'h', code: 'KeyH', keyCode: 72, which: 72, ctrlKey: true }
    fireEvent.keyDown(document.body, init)
    if (reacted()) return

    fireEvent.keyUp(document.body, init)
  }

  test('calls the logOut function passed as a prop when ctrl and h are pressed', async () => {
    const logOut = jest.fn()
    render(<App logOut={logOut} />)

    await pressCtrlH(logOut)

    expect(logOut).toHaveBeenCalledTimes(1)
  })

  test('alerts with the string Logging you out when ctrl and h are pressed', async () => {
    const logOut = jest.fn()
    render(<App logOut={logOut} />)

    await pressCtrlH(logOut)

    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringMatching(/logging you out/i)
    )
  })
})
