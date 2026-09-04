import { fireEvent, render } from '@testing-library/react'
import NotificationItem from './NotificationItem'

describe('NotificationItem', () => {
  test('renders a blue li with data-notification-type default', () => {
    const { container } = render(
      <NotificationItem type="default" value="New course available" />
    )
    const item = container.querySelector('li')

    expect(item).toBeInTheDocument()
    expect(item).toHaveAttribute('data-notification-type', 'default')
    expect(item).toHaveStyle({ color: 'blue' })
  })

  test('renders a red li with data-notification-type urgent', () => {
    const { container } = render(
      <NotificationItem type="urgent" value="New resume available" />
    )
    const item = container.querySelector('li')

    expect(item).toBeInTheDocument()
    expect(item).toHaveAttribute('data-notification-type', 'urgent')
    expect(item).toHaveStyle({ color: 'red' })
  })

  test('renders the value as text', () => {
    const { container } = render(
      <NotificationItem type="default" value="New course available" />
    )

    expect(container.querySelector('li')).toHaveTextContent(
      /new course available/i
    )
  })

  test('renders the html prop as markup', () => {
    const { container } = render(
      <NotificationItem
        type="urgent"
        html={{ __html: '<strong>Urgent requirement</strong> - complete by EOD' }}
      />
    )
    const item = container.querySelector('li')

    expect(item.querySelector('strong')).toBeInTheDocument()
    expect(item).toHaveTextContent(/urgent requirement - complete by eod/i)
  })

  test('does not crash when no prop is passed', () => {
    const { container } = render(<NotificationItem />)

    expect(container.querySelector('li')).toBeInTheDocument()
  })

  test('calls markAsRead with its id when the li is clicked', () => {
    const markAsRead = jest.fn()
    const { container } = render(
      <NotificationItem
        id={7}
        type="default"
        value="New course available"
        markAsRead={markAsRead}
      />
    )

    // Nothing is called until the item is actually hit.
    expect(markAsRead).not.toHaveBeenCalled()

    fireEvent.click(container.querySelector('li'))

    expect(markAsRead).toHaveBeenCalledTimes(1)
    expect(markAsRead).toHaveBeenCalledWith(7)
  })

  test('calls markAsRead as well when the item holds markup', () => {
    const markAsRead = jest.fn()
    const { container } = render(
      <NotificationItem
        id={3}
        type="urgent"
        html={{ __html: '<strong>Urgent requirement</strong>' }}
        markAsRead={markAsRead}
      />
    )

    fireEvent.click(container.querySelector('li'))

    expect(markAsRead).toHaveBeenCalledWith(3)
  })
})
