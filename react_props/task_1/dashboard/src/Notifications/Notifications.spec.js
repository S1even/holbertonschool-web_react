import { render, screen, fireEvent } from '@testing-library/react'
import Notifications from './Notifications'

describe('Notifications', () => {
  test('renders the notifications title', () => {
    render(<Notifications />)

    expect(
      screen.getByText(/here is the list of notifications/i)
    ).toBeInTheDocument()
  })

  test('renders a button element', () => {
    render(<Notifications />)

    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
  })

  test('renders 3 li elements', () => {
    const { container } = render(<Notifications />)

    expect(container.querySelectorAll('li')).toHaveLength(3)
  })

  test('logs to the console when the close button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    render(<Notifications />)

    // Nothing is logged until the button is actually hit.
    expect(consoleSpy).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    // Exact string on purpose: this assertion has to catch a handler that logs
    // anything else, so it must not be loosened to a case-insensitive match.
    expect(consoleSpy).toHaveBeenCalledWith('Close button has been clicked')

    consoleSpy.mockRestore()
  })
})
