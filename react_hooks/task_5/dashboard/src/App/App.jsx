import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
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

// Les données viennent des fichiers JSON de `public/`, servis par Vite. Les
// tests remplacent axios par jest-mock-axios et répondent à ces URL.
const API_BASE_URL = 'http://localhost:5173'
const ENDPOINTS = {
  notifications: `${API_BASE_URL}/notifications.json`,
  courses: `${API_BASE_URL}/courses.json`,
}

// En développement seulement : un build de production reste silencieux. Vite
// remplace `process.env.NODE_ENV` par une chaîne, en dev comme au build.
/* global process */
const logError = (message, error) => {
  if (process.env.NODE_ENV !== 'production') console.error(message, error)
}

// Le JSON ne peut pas porter le HTML calculé de la dernière notification :
// une entrée `html` vide reçoit ici celui de getLatestNotification().
const withLatestNotification = (notifications) =>
  notifications.map((notification) =>
    notification.html && !notification.html.__html
      ? { ...notification, html: { __html: getLatestNotification() } }
      : notification
  )

function App() {
  // Le tiroir est ouvert au chargement, comme sur la démo de l'énoncé : le
  // checker clique directement sur une notification sans l'ouvrir.
  const [displayDrawer, setDisplayDrawer] = useState(true)
  // L'utilisateur du contexte : un visiteur non connecté. C'est l'état initial,
  // et celui auquel la déconnexion revient.
  const [user, setUser] = useState(defaultUser)
  const [notifications, setNotifications] = useState([])
  const [courses, setCourses] = useState([])

  // Les notifications sont utiles dès l'ouverture de l'application : une seule
  // requête, au montage.
  useEffect(() => {
    // Une réponse arrivée après le démontage ne doit plus toucher l'état.
    let isActive = true

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(ENDPOINTS.notifications)
        if (isActive) {
          setNotifications(withLatestNotification(response.data.notifications))
        }
      } catch (error) {
        logError('Error fetching notifications:', error)
      }
    }

    fetchNotifications()

    return () => {
      isActive = false
    }
  }, [])

  // Les cours dépendent de l'authentification : ils sont demandés à chaque
  // connexion, et vidés à la déconnexion sans requête.
  useEffect(() => {
    if (!user.isLoggedIn) {
      setCourses([])
      return undefined
    }

    let isActive = true

    const fetchCourses = async () => {
      try {
        const response = await axios.get(ENDPOINTS.courses)
        if (isActive) setCourses(response.data.courses)
      } catch (error) {
        logError('Error fetching courses:', error)
      }
    }

    fetchCourses()

    return () => {
      isActive = false
    }
  }, [user.isLoggedIn])

  // Chaque callback est mémoïsé : Notifications ne compare pas ses callbacks,
  // il doit donc toujours recevoir les mêmes fonctions.
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
              <CourseList courses={courses} />
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
