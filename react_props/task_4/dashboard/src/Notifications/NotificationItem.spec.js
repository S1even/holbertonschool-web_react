import { render } from '@testing-library/react'
import NotificationItem from './NotificationItem'

describe('NotificationItem', () => {
  test('renders default notifications in blue', () => {
    const { container } = render(
      <NotificationItem type="default" value="New course available" />,
    )
    const item = container.querySelector('li')

    expect(item).toHaveStyle({ color: 'blue' })
    expect(item).toHaveAttribute('data-notification-type', 'default')
  })

  test('renders urgent notifications in red', () => {
    const { container } = render(
      <NotificationItem type="urgent" value="New resume available" />,
    )
    const item = container.querySelector('li')

    expect(item).toHaveStyle({ color: 'red' })
    expect(item).toHaveAttribute('data-notification-type', 'urgent')
  })
})
