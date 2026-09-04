import { Component } from 'react'

class NotificationItem extends Component {
  render() {
    const { id, type, html, value, markAsRead } = this.props
    const style = {
      color: type === 'urgent' ? 'red' : 'blue',
    }

    if (html) {
      return (
        <li
          data-notification-type={type}
          dangerouslySetInnerHTML={html}
          onClick={() => markAsRead(id)}
          style={style}
        />
      )
    }

    return (
      <li
        data-notification-type={type}
        onClick={() => markAsRead(id)}
        style={style}
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
