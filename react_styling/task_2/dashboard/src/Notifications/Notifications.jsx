import { Component } from 'react'
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
      // Le panneau se place en haut à droite de la page et en occupe un quart.
      <div className="absolute top-[10px] right-5 w-1/4">
        <div className="notification-title text-right mb-1.5">
          Your notifications
        </div>
        {displayDrawer && (
          <div className="notification-items border-2 border-dashed border-(--main-color) p-1.5">
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
                {/* Le preflight de Tailwind remet les listes à zéro : les puces
                    et le retrait sont donc rétablis explicitement. */}
                <ul className="list-disc mt-2 pl-6">
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
      </div>
    )
  }
}

Notifications.defaultProps = {
  displayDrawer: false,
  notifications: [],
}

export default Notifications
