import { render, screen, fireEvent } from '@testing-library/react'
import Notifications from './Notifications'
import { getLatestNotification } from '../utils/utils'

const notifications = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', value: { __html: getLatestNotification() } },
]

describe('Notifications', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('always renders the notifications title', () => {
    render(<Notifications />)

    expect(screen.getByText(/your notifications/i)).toBeInTheDocument()
  })

  test('does not render the drawer when displayDrawer is false', () => {
    render(<Notifications />)

    expect(screen.getByText(/your notifications/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /close/i })).toBeNull()
    expect(
      screen.queryByText(/here is the list of notifications/i),
    ).toBeNull()
    expect(screen.queryByRole('listitem')).toBeNull()
  })

  test('renders the drawer when displayDrawer is true', () => {
    const { container } = render(
      <Notifications displayDrawer notifications={notifications} />,
    )

    expect(screen.getByText(/your notifications/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    expect(
      screen.getByText(/here is the list of notifications/i),
    ).toBeInTheDocument()

    expect(container.querySelectorAll('li')).toHaveLength(3)
  })

  test('renders the notification text from the notifications prop', () => {
    render(<Notifications displayDrawer notifications={notifications} />)

    expect(screen.getByText(/new course available/i)).toBeInTheDocument()
    expect(screen.getByText(/new resume available/i)).toBeInTheDocument()
    expect(screen.getByText(/urgent requirement/i)).toBeInTheDocument()
  })

  test('renders an empty notification message when the drawer is open and notifications is empty', () => {
    render(<Notifications displayDrawer notifications={[]} />)

    expect(screen.getByText(/your notifications/i)).toBeInTheDocument()
    expect(screen.getByText(/no new notification for now/i)).toBeInTheDocument()
  })

  test('logs to the console when the close button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    render(<Notifications displayDrawer notifications={notifications} />)

    // Nothing is logged until the button is actually hit.
    expect(consoleSpy).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    // Exact string on purpose: this assertion has to catch a handler that logs
    // anything else, so it must not be loosened to a case-insensitive match.
    expect(consoleSpy).toHaveBeenCalledWith('Close button has been clicked')
  })

  test('logs the notification id when a notification item is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    render(<Notifications displayDrawer notifications={notifications} />)

    fireEvent.click(screen.getByText(/new course available/i))

    expect(consoleSpy).toHaveBeenCalledWith(
      'Notification 1 has been marked as read',
    )
  })
})
