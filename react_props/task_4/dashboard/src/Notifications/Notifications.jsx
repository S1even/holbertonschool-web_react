import './Notifications.css'
import closeButton from '../assets/close-button.png'
import NotificationItem from './NotificationItem'

function Notifications({ notifications = [] }) {
  return (
    <div className="notification-items">
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
        {notifications.map(({ id, type, value, html }) => (
          <NotificationItem
            key={id}
            type={type}
            value={typeof value === 'string' ? value : ''}
            html={html || (typeof value === 'object' ? value : null)}
          />
        ))}
      </ul>
    </div>
  )
}

export default Notifications
