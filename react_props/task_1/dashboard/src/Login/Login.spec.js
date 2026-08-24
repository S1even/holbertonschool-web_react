import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from './Login'

describe('Login', () => {
  test('renders 2 labels, 2 inputs, and 1 button', () => {
    const { container } = render(<Login />)

    expect(container.querySelectorAll('label')).toHaveLength(2)
    expect(container.querySelectorAll('input')).toHaveLength(2)
    expect(container.querySelectorAll('button')).toHaveLength(1)
  })

  test('focuses inputs when their labels are clicked', async () => {
    const user = userEvent.setup()
    render(<Login />)

    await user.click(screen.getByText(/email:/i))
    expect(screen.getByLabelText(/email/i)).toHaveFocus()

    await user.click(screen.getByText(/password:/i))
    expect(screen.getByLabelText(/password/i)).toHaveFocus()
  })
})
