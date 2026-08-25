function NotificationItem({ type = 'default', html = null, value = '' }) {
  const style = {
    color: type === 'urgent' ? 'red' : 'blue',
  }

  if (html) {
    return (
      <li
        data-notification-type={type}
        dangerouslySetInnerHTML={html}
        style={style}
      />
    )
  }

  return (
    <li data-notification-type={type} style={style}>
      {value}
    </li>
  )
}

export default NotificationItem
