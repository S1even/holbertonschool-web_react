import { render, screen, fireEvent } from '@testing-library/react'
import Notifications from './Notifications'
import { getLatestNotification } from '../utils/utils'

const notificationsList = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', value: { __html: getLatestNotification() } },
]

describe('Notifications', () => {
  test('always renders the notification-title with the text Your notifications', () => {
    const { container } = render(
      <Notifications notifications={notificationsList} />
    )

    expect(container.querySelector('.notification-title')).toHaveTextContent(
      /your notifications/i
    )
  })

  describe('when displayDrawer is false', () => {
    test('still renders the text Your notifications', () => {
      render(
        <Notifications displayDrawer={false} notifications={notificationsList} />
      )

      expect(screen.getByText(/your notifications/i)).toBeInTheDocument()
    })

    test('does not render the close button', () => {
      render(
        <Notifications displayDrawer={false} notifications={notificationsList} />
      )

      expect(
        screen.queryByRole('button', { name: /close/i })
      ).not.toBeInTheDocument()
    })

    test('does not render the p element with the list title', () => {
      render(
        <Notifications displayDrawer={false} notifications={notificationsList} />
      )

      expect(
        screen.queryByText(/here is the list of notifications/i)
      ).not.toBeInTheDocument()
    })

    test('does not render the notification items', () => {
      const { container } = render(
        <Notifications displayDrawer={false} notifications={notificationsList} />
      )

      expect(container.querySelectorAll('li')).toHaveLength(0)
      expect(container.querySelector('.notification-items')).toBeNull()
    })

    test('is the default, so the drawer stays closed without the prop', () => {
      const { container } = render(
        <Notifications notifications={notificationsList} />
      )

      expect(container.querySelector('.notification-items')).toBeNull()
    })
  })

  describe('when displayDrawer is true', () => {
    test('still renders the text Your notifications', () => {
      render(
        <Notifications displayDrawer notifications={notificationsList} />
      )

      expect(screen.getByText(/your notifications/i)).toBeInTheDocument()
    })

    test('renders the close button', () => {
      render(<Notifications displayDrawer notifications={notificationsList} />)

      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    })

    test('renders the p element with the list title', () => {
      render(<Notifications displayDrawer notifications={notificationsList} />)

      expect(
        screen.getByText(/here is the list of notifications/i)
      ).toBeInTheDocument()
    })

    test('renders the 3 notification items with their text', () => {
      const { container } = render(
        <Notifications displayDrawer notifications={notificationsList} />
      )
      const items = Array.from(container.querySelectorAll('li'))

      expect(items).toHaveLength(3)
      expect(items[0]).toHaveTextContent(/new course available/i)
      expect(items[1]).toHaveTextContent(/new resume available/i)
      // The third one is markup, so its tags are parsed rather than escaped.
      expect(items[2]).toHaveTextContent(/urgent requirement - complete by eod/i)
      expect(items[2].querySelector('strong')).toBeInTheDocument()
    })

    test('renders each notification item with its type', () => {
      const { container } = render(
        <Notifications displayDrawer notifications={notificationsList} />
      )
      const items = Array.from(container.querySelectorAll('li'))

      expect(items[0]).toHaveAttribute('data-notification-type', 'default')
      expect(items[1]).toHaveAttribute('data-notification-type', 'urgent')
      expect(items[2]).toHaveAttribute('data-notification-type', 'urgent')
    })

    test('logs to the console when the close button is clicked', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
      render(<Notifications displayDrawer notifications={notificationsList} />)

      // Nothing is logged until the button is actually hit.
      expect(consoleSpy).not.toHaveBeenCalled()

      fireEvent.click(screen.getByRole('button', { name: /close/i }))

      // Case-insensitive on the wording, but still strict enough to reject a
      // handler that logs a different message entirely.
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/close button has been clicked/i)
      )

      consoleSpy.mockRestore()
    })

    test('logs the id of the notification item that was clicked', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
      const { container } = render(
        <Notifications displayDrawer notifications={notificationsList} />
      )
      const items = Array.from(container.querySelectorAll('li'))

      fireEvent.click(items[0])

      // Ids come from the notifications prop, so the first item is 1, not 0.
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/notification 1 has been marked as read/i)
      )

      fireEvent.click(items[1])

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/notification 2 has been marked as read/i)
      )

      consoleSpy.mockRestore()
    })
  })

  describe('when displayDrawer is true and notifications is empty', () => {
    test('renders the text No new notification for now', () => {
      render(<Notifications displayDrawer notifications={[]} />)

      expect(
        screen.getByText(/no new notification for now/i)
      ).toBeInTheDocument()
    })

    test('still renders the text Your notifications', () => {
      render(<Notifications displayDrawer notifications={[]} />)

      expect(screen.getByText(/your notifications/i)).toBeInTheDocument()
    })

    test('does not render any notification item', () => {
      const { container } = render(
        <Notifications displayDrawer notifications={[]} />
      )

      expect(container.querySelectorAll('li')).toHaveLength(0)
    })

    test('falls back to the empty state without the notifications prop', () => {
      render(<Notifications displayDrawer />)

      expect(
        screen.getByText(/no new notification for now/i)
      ).toBeInTheDocument()
    })
  })
})
