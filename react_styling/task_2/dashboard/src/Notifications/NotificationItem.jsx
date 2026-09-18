import { PureComponent } from 'react'

// Pure: an item only re-renders when one of its own props actually changes.
class NotificationItem extends PureComponent {
  render() {
    const { id, type, html, value, markAsRead } = this.props
    const itemClasses =
      type === 'urgent'
        ? 'mb-0.5 text-[var(--urgent-notification-item)]'
        : 'mb-0.5 text-[var(--default-notification-item)]'

    if (html) {
      return (
        <li
          className={itemClasses}
          data-notification-type={type}
          onClick={() => markAsRead(id)}
          dangerouslySetInnerHTML={html}
        />
      )
    }

    return (
      <li
        className={itemClasses}
        data-notification-type={type}
        onClick={() => markAsRead(id)}
      >
        {value}
      </li>
    )
  }
}

NotificationItem.defaultProps = {
  id: 0,
  type: 'default',
  html: null,
  value: '',
  markAsRead: () => {},
}

export default NotificationItem
