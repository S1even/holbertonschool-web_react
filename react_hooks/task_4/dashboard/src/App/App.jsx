import { useCallback, useMemo, useState } from 'react'
import Notifications from '../Notifications/Notifications'
import Header from '../Header/Header'
import Login from '../Login/Login'
import CourseList from '../CourseList/CourseList'
import Footer from '../Footer/Footer'
import BodySection from '../BodySection/BodySection'
import BodySectionWithMarginBottom from '../BodySection/BodySectionWithMarginBottom'
import newContext, { user as defaultUser } from '../Context/context'
import { getLatestNotification } from '../utils/utils'

// Nommé en capitale : ESLint, sans plugin React, ne reconnaît comme utilisée
// en JSX qu'une variable qui commence par une majuscule.
const ContextProvider = newContext.Provider

const notificationsList = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', html: { __html: getLatestNotification() } },
]

const coursesList = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
  { id: 3, name: 'React', credit: 40 },
]

function App() {
  const [displayDrawer, setDisplayDrawer] = useState(true)
  // L'utilisateur du contexte : un visiteur non connecté. C'est l'état initial,
  // et celui auquel la déconnexion revient.
  const [user, setUser] = useState(defaultUser)
  const [notifications, setNotifications] = useState(notificationsList)

  // Des callbacks stables permettent à Notifications de conserver son rendu
  // tant que le tiroir et la liste ne changent pas.
  const handleDisplayDrawer = useCallback(() => {
    setDisplayDrawer(true)
  }, [])

  const handleHideDrawer = useCallback(() => {
    setDisplayDrawer(false)
  }, [])

  const logIn = useCallback((email, password) => {
    setUser({ email, password, isLoggedIn: true })
  }, [])

  const logOut = useCallback(() => {
    setUser(defaultUser)
  }, [])

  // Une nouvelle liste plutôt qu'un retrait sur place, calculée depuis l'état
  // courant : deux clics rapprochés ne s'écrasent pas.
  const markNotificationAsRead = useCallback((id) => {
    console.log(`Notification ${id} has been marked as read`)
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    )
  }, [])

  // Le Provider compare sa valeur par référence : un objet recréé à chaque
  // rendu ferait re-rendre tous ses consommateurs, même quand seul le tiroir
  // bouge. L'objet n'est donc reconstruit que si l'utilisateur a changé.
  const contextValue = useMemo(() => ({ user, logOut }), [user, logOut])

  return (
    <ContextProvider value={contextValue}>
      {/* Conteneur de l'application : une colonne flex d'au moins une
          hauteur d'écran, ce qui laisse le pied de page se coller en bas, et
          l'ancrage `relative` du panneau de notifications. */}
      <div className="relative flex min-h-screen flex-col px-3">
        <div className="root-notifications">
          {/* Le tiroir et sa liste sont des états d'App : Notifications les
              affiche et signale les clics par ses callbacks. */}
          <Notifications
            notifications={notifications}
            displayDrawer={displayDrawer}
            handleDisplayDrawer={handleDisplayDrawer}
            handleHideDrawer={handleHideDrawer}
            markNotificationAsRead={markNotificationAsRead}
          />
        </div>
        <Header />
        <div className="App-body pt-[38px]">
          {user.isLoggedIn ? (
            <BodySectionWithMarginBottom title="Course list">
              <CourseList courses={coursesList} />
            </BodySectionWithMarginBottom>
          ) : (
            <BodySectionWithMarginBottom title="Log in to continue">
              <Login
                logIn={logIn}
                email={user.email}
                password={user.password}
              />
            </BodySectionWithMarginBottom>
          )}
          <BodySection title="News from the School">
            <p>
              ipsum Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Similique, asperiores architecto blanditiis fuga doloribus sit
              illum aliquid ea distinctio minus accusantium, impedit quo
              voluptatibus ut magni dicta. Recusandae, quia dicta?
            </p>
          </BodySection>
        </div>
        <Footer />
      </div>
    </ContextProvider>
  )
}

export default App
