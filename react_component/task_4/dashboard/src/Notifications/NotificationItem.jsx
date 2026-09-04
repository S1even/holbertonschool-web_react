import { Component } from 'react'

class NotificationItem extends Component {
  render() {
    const { id, type, html, value, markAsRead } = this.props
    // The colours used to live in Notifications.css, keyed on the type attribute.
    const style = { color: type === 'urgent' ? 'red' : 'blue' }

    if (html) {
      return (
        <li
          data-notification-type={type}
          style={style}
          onClick={() => markAsRead(id)}
          dangerouslySetInnerHTML={html}
        />
      )
    }

    return (
      <li
        data-notification-type={type}
        style={style}
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
