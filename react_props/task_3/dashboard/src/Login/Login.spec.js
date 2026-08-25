import { render } from '@testing-library/react'
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
    const { container } = render(<Login />)
    const labels = container.querySelectorAll('label')
    const inputs = container.querySelectorAll('input')

    await user.click(labels[0])
    expect(inputs[0]).toHaveFocus()

    await user.click(labels[1])
    expect(inputs[1]).toHaveFocus()
  })
})
