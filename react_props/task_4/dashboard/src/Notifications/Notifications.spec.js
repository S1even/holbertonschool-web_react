import { render, screen, fireEvent } from '@testing-library/react'
import Notifications from './Notifications'
import { getLatestNotification } from '../utils/utils'

const notifications = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', value: { __html: getLatestNotification() } },
]

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
    const { container } = render(<Notifications notifications={notifications} />)

    expect(container.querySelectorAll('li')).toHaveLength(3)
  })

  test('renders the notification text from the notifications prop', () => {
    render(<Notifications notifications={notifications} />)

    expect(screen.getByText(/new course available/i)).toBeInTheDocument()
    expect(screen.getByText(/new resume available/i)).toBeInTheDocument()
    expect(screen.getByText(/urgent requirement/i)).toBeInTheDocument()
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
