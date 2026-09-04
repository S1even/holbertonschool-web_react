import { Component } from 'react'
import './Notifications.css'
import closeButton from '../assets/close-button.png'
import NotificationItem from './NotificationItem'

class Notifications extends Component {
  constructor(props) {
    super(props)
    this.markAsRead = this.markAsRead.bind(this)
  }

  // Only a list of a different length is worth a new render.
  shouldComponentUpdate(nextProps) {
    return nextProps.notifications.length !== this.props.notifications.length
  }

  markAsRead(id) {
    console.log(`Notification ${id} has been marked as read`)
  }

  render() {
    const { displayDrawer, notifications } = this.props

    return (
      <>
        <div className="notification-title">Your notifications</div>
        {displayDrawer && (
          <div className="notification-items">
            {notifications.length === 0 ? (
              <p>No new notification for now</p>
            ) : (
              <>
                <button
                  aria-label="Close"
                  onClick={() => console.log('Close button has been clicked')}
                  style={{
                    float: 'right',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <img src={closeButton} alt="close" width="12" height="12" />
                </button>
                <p>Here is the list of notifications</p>
                <ul>
                  {notifications.map(({ id, type, html, value }) => {
                    // A notification carrying markup is handed to
                    // dangerouslySetInnerHTML, whether it arrives under `html`
                    // or as an object-shaped `value`.
                    const markup =
                      html ??
                      (value !== null && typeof value === 'object'
                        ? value
                        : null)

                    return (
                      <NotificationItem
                        key={id}
                        id={id}
                        type={type}
                        html={markup}
                        value={markup ? undefined : value}
                        markAsRead={this.markAsRead}
                      />
                    )
                  })}
                </ul>
              </>
            )}
          </div>
        )}
      </>
    )
  }
}

Notifications.defaultProps = {
  displayDrawer: false,
  notifications: [],
}

export default Notifications
