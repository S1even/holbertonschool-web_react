import { act, render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from './Login'
import useLogin from '../hooks/useLogin'

describe('Login', () => {
  test('renders 2 label, 2 input and 1 button elements', () => {
    const { container } = render(<Login />)

    const labels = Array.from(container.querySelectorAll('label'))
    // Only the email and password fields count, not a submit/button input.
    const inputs = Array.from(container.querySelectorAll('input')).filter(
      (input) => !['button', 'reset', 'submit'].includes(input.type)
    )

    expect(labels).toHaveLength(2)
    // Order-independent, so the assertion survives a reordered form.
    expect(labels.some((label) => /email/i.test(label.textContent))).toBe(true)
    expect(labels.some((label) => /password/i.test(label.textContent))).toBe(
      true
    )

    expect(inputs).toHaveLength(2)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /^ok$/i })).toBeInTheDocument()
  })

  test('focuses the related input when a label is clicked', async () => {
    const user = userEvent.setup()
    const { container } = render(<Login />)

    const labels = Array.from(container.querySelectorAll('label'))
    const emailLabel = labels.find((label) => /email/i.test(label.textContent))
    const passwordLabel = labels.find((label) =>
      /password/i.test(label.textContent)
    )

    await user.click(emailLabel)
    expect(screen.getByLabelText(/email/i)).toHaveFocus()

    await user.click(passwordLabel)
    expect(screen.getByLabelText(/password/i)).toHaveFocus()
  })

  describe('the submit input', () => {
    const submit = () => screen.getByRole('button', { name: /^ok$/i })

    test('is disabled by default', () => {
      render(<Login />)

      expect(submit()).toBeDisabled()
    })

    test('is enabled only once both email and password are valid', async () => {
      const user = userEvent.setup()
      render(<Login />)
      const email = screen.getByLabelText(/email/i)
      const password = screen.getByLabelText(/password/i)

      // A valid email alone is not enough.
      await user.type(email, 'user@example.com')
      expect(submit()).toBeDisabled()

      // Seven characters: one short of the minimum.
      await user.type(password, '1234567')
      expect(submit()).toBeDisabled()

      await user.type(password, '8')
      expect(submit()).toBeEnabled()

      // An invalid email turns it off again, despite a valid password.
      await user.clear(email)
      await user.type(email, 'not-an-email')
      expect(submit()).toBeDisabled()
    })

    test('keeps the inputs in sync with what the user types', async () => {
      const user = userEvent.setup()
      render(<Login />)

      await user.type(screen.getByLabelText(/email/i), 'user@example.com')
      await user.type(screen.getByLabelText(/password/i), 'secret-password')

      expect(screen.getByLabelText(/email/i)).toHaveValue('user@example.com')
      expect(screen.getByLabelText(/password/i)).toHaveValue('secret-password')
    })

    test('does not reload the page when the form is submitted', async () => {
      const user = userEvent.setup()
      const { container } = render(<Login />)
      const form = container.querySelector('form')
      const onSubmit = jest.fn((event) => event.defaultPrevented)
      // Listener on the document, so it runs after React's handler has had
      // the chance to cancel the default action.
      document.addEventListener('submit', onSubmit)

      await user.type(screen.getByLabelText(/email/i), 'user@example.com')
      await user.type(screen.getByLabelText(/password/i), 'secret-password')
      await user.click(submit())

      expect(form).toBeInTheDocument()
      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit.mock.results[0].value).toBe(true)

      document.removeEventListener('submit', onSubmit)
    })
  })

  describe('the logIn prop', () => {
    test('is called with the email and password when the form is submitted', async () => {
      const user = userEvent.setup()
      const logIn = jest.fn()
      render(<Login logIn={logIn} />)

      await user.type(screen.getByLabelText(/email/i), 'user@example.com')
      await user.type(screen.getByLabelText(/password/i), 'secret-password')
      await user.click(screen.getByRole('button', { name: /^ok$/i }))

      expect(logIn).toHaveBeenCalledTimes(1)
      expect(logIn).toHaveBeenCalledWith('user@example.com', 'secret-password')
    })

    test('is not called while the submit input is disabled', async () => {
      const user = userEvent.setup()
      const logIn = jest.fn()
      render(<Login logIn={logIn} />)

      await user.type(screen.getByLabelText(/email/i), 'user@example.com')
      await user.type(screen.getByLabelText(/password/i), 'short')
      await user.click(screen.getByRole('button', { name: /^ok$/i }))

      expect(logIn).not.toHaveBeenCalled()
    })

    test('is called with the values typed last, after a correction', async () => {
      const user = userEvent.setup()
      const logIn = jest.fn()
      render(<Login logIn={logIn} />)
      const email = screen.getByLabelText(/email/i)

      await user.type(email, 'first@example.com')
      await user.type(screen.getByLabelText(/password/i), 'secret-password')
      await user.clear(email)
      await user.type(email, 'second@example.com')
      await user.click(screen.getByRole('button', { name: /^ok$/i }))

      expect(logIn).toHaveBeenCalledWith('second@example.com', 'secret-password')
    })
  })

  describe('as a function component', () => {
    test('starts with empty inputs, whatever the props', () => {
      render(<Login email="user@example.com" password="secret-password" />)

      expect(screen.getByLabelText(/email/i)).toHaveValue('')
      expect(screen.getByLabelText(/password/i)).toHaveValue('')
      expect(screen.getByRole('button', { name: /^ok$/i })).toBeDisabled()
    })

    test('is still wrapped by WithLogging', () => {
      expect(Login.displayName).toMatch(/WithLogging\(Login\)/)
    })
  })
})

// The form logic now lives in useLogin: the hook is checked on its own, with
// change events shaped like the ones the inputs send.
describe('useLogin', () => {
  const change = (value) => ({ target: { value } })

  test('starts with empty fields and the submit disabled', () => {
    const { result } = renderHook(() => useLogin(jest.fn()))

    expect(result.current.email).toBe('')
    expect(result.current.password).toBe('')
    expect(result.current.enableSubmit).toBe(false)
  })

  test('updates each field and keeps the other one', () => {
    const { result } = renderHook(() => useLogin(jest.fn()))

    act(() => result.current.handleChangeEmail(change('user@example.com')))
    act(() => result.current.handleChangePassword(change('secret-password')))

    expect(result.current.email).toBe('user@example.com')
    expect(result.current.password).toBe('secret-password')
  })

  test('enables the submit only for a valid email and an 8-character password', () => {
    const { result } = renderHook(() => useLogin(jest.fn()))

    act(() => result.current.handleChangeEmail(change('not-an-email')))
    act(() => result.current.handleChangePassword(change('12345678')))
    expect(result.current.enableSubmit).toBe(false)

    act(() => result.current.handleChangeEmail(change('user@example.com')))
    expect(result.current.enableSubmit).toBe(true)

    act(() => result.current.handleChangePassword(change('1234567')))
    expect(result.current.enableSubmit).toBe(false)
  })

  test('prevents the default submission and calls onLogin with the fields', () => {
    const onLogin = jest.fn()
    const preventDefault = jest.fn()
    const { result } = renderHook(() => useLogin(onLogin))

    act(() => result.current.handleChangeEmail(change('user@example.com')))
    act(() => result.current.handleChangePassword(change('secret-password')))
    act(() => result.current.handleLoginSubmit({ preventDefault }))

    expect(preventDefault).toHaveBeenCalledTimes(1)
    expect(onLogin).toHaveBeenCalledWith('user@example.com', 'secret-password')
  })

  test('does not crash on submit without an onLogin callback', () => {
    const { result } = renderHook(() => useLogin())

    expect(() =>
      act(() => result.current.handleLoginSubmit({ preventDefault: () => {} }))
    ).not.toThrow()
  })
})
