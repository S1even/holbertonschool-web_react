import { PureComponent } from 'react'

// Pure: an item only re-renders when one of its own props actually changes.
class NotificationItem extends PureComponent {
  render() {
    const { id, type, html, value, markAsRead } = this.props
    // Les deux couleurs viennent du thème : `text-(--x)` est le raccourci v4
    // de `text-[var(--x)]`, le seul moyen de viser une variable qui n'est pas
    // préfixée `--color-*` et n'a donc pas d'utilitaire généré.
    const colorClass =
      type === 'urgent'
        ? 'text-(--urgent-notification-item)'
        : 'text-(--default-notification-item)'

    if (html) {
      return (
        <li
          data-notification-type={type}
          className={colorClass}
          onClick={() => markAsRead(id)}
          dangerouslySetInnerHTML={html}
        />
      )
    }

    return (
      <li
        data-notification-type={type}
        className={colorClass}
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
