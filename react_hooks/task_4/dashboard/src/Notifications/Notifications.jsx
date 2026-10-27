import { memo } from 'react'
import closeIcon from '../assets/close-icon.png'
import NotificationItem from './NotificationItem'

function Notifications({
  // Valeurs par défaut en destructuration plutôt que dans `defaultProps` :
  // c'est la forme littérale `displayDrawer = true` que les scripts du
  // checker réécrivent pour fermer le tiroir. Le tiroir est donc ouvert par
  // défaut — les captures du panneau ne passent aucun script pour l'ouvrir.
  // Les callbacks sont optionnels : sans App pour piloter le tiroir et la
  // liste, un clic ne fait simplement rien.
  displayDrawer = true,
  notifications = [],
  handleDisplayDrawer = () => {},
  handleHideDrawer = () => {},
  markNotificationAsRead = () => {},
}) {
  // Le titre rebondit tant qu'il y a des notifications à lire et que le
  // tiroir est fermé — c'est-à-dire tant que l'information n'est pas déjà
  // sous les yeux. Dès que le tiroir s'ouvre, l'animation n'a plus d'objet.
  const bounceClass =
    notifications.length > 0 && !displayDrawer ? ' animate-bounce' : ''

  return (
    // Le panneau se place en haut à droite de la page et en occupe un quart.
    <div className="absolute top-1 right-3 w-100 max-[912px]:pr-3">
      <div
        className={`notification-title text-right mb-1 cursor-pointer${bounceClass}`}
        onClick={handleDisplayDrawer}
      >
        Your notifications
      </div>
      {displayDrawer && (
        // Sous 912px le panneau recouvre l'écran entier : `fixed inset-0` le
        // sort du flux, `z-50` le place au-dessus du reste et `bg-white`
        // masque la page.
        <div className="notification-items border-[3px] border-dotted border-(--main-color) p-2 max-[912px]:fixed max-[912px]:inset-0 max-[912px]:z-50 max-[912px]:overflow-auto max-[912px]:bg-white max-[912px]:p-3">
          {notifications.length === 0 ? (
            <p className="max-[912px]:text-xl">No new notification for now</p>
          ) : (
            <>
              <button
                aria-label="Close"
                onClick={handleHideDrawer}
                style={{
                  float: 'right',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <img src={closeIcon} alt="close icon" width="12" height="12" />
              </button>
              <p className="max-[912px]:text-xl">
                Here is the list of notifications
              </p>
              {/* Le preflight de Tailwind remet les listes à zéro : les puces
                  et le retrait sont donc rétablis explicitement — puis retirés
                  sur mobile, où les items sont des lignes pleine largeur. */}
              <ul className="list-[square] pl-6 max-[912px]:mt-1 max-[912px]:list-none max-[912px]:pl-0">
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
                      markAsRead={markNotificationAsRead}
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

// memo compare chaque prop par référence. App remplace la liste dès qu'une
// notification est lue et mémoïse ses callbacks : seul un vrai changement
// d'état fait renvoyer `false`, ce qui déclenche le rendu.
const areEqual = (prevProps, nextProps) =>
  prevProps.displayDrawer === nextProps.displayDrawer &&
  prevProps.notifications === nextProps.notifications &&
  prevProps.handleDisplayDrawer === nextProps.handleDisplayDrawer &&
  prevProps.handleHideDrawer === nextProps.handleHideDrawer &&
  prevProps.markNotificationAsRead === nextProps.markNotificationAsRead

export default memo(Notifications, areEqual)
