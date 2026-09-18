import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from './Login'

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
})
