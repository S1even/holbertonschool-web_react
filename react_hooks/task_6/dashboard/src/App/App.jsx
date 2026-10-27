import { useCallback, useEffect, useReducer } from 'react'
import axios from 'axios'
import Notifications from '../Notifications/Notifications'
import Header from '../Header/Header'
import Login from '../Login/Login'
import CourseList from '../CourseList/CourseList'
import Footer from '../Footer/Footer'
import BodySection from '../BodySection/BodySection'
import BodySectionWithMarginBottom from '../BodySection/BodySectionWithMarginBottom'
import { getLatestNotification } from '../utils/utils'
import { APP_ACTIONS, appReducer, initialState } from './appReducer'

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
  // Tout l'état d'App vit dans un seul reducer : chaque changement passe par
  // une action de APP_ACTIONS, et les enfants le reçoivent par leurs props.
  const [state, dispatch] = useReducer(appReducer, initialState)
  const { displayDrawer, user, notifications, courses } = state

  // Les notifications sont utiles dès l'ouverture de l'application : une seule
  // requête, au montage.
  useEffect(() => {
    // Une réponse arrivée après le démontage ne doit plus toucher l'état.
    let isActive = true

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(ENDPOINTS.notifications)
        if (isActive) {
          dispatch({
            type: APP_ACTIONS.SET_NOTIFICATIONS,
            payload: withLatestNotification(response.data.notifications),
          })
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
  // connexion. À la déconnexion, LOGOUT les vide déjà dans le reducer.
  useEffect(() => {
    if (!user.isLoggedIn) return undefined

    let isActive = true

    const fetchCourses = async () => {
      try {
        const response = await axios.get(ENDPOINTS.courses)
        if (isActive) {
          dispatch({
            type: APP_ACTIONS.SET_COURSES,
            payload: response.data.courses,
          })
        }
      } catch (error) {
        logError('Error fetching courses:', error)
      }
    }

    fetchCourses()

    return () => {
      isActive = false
    }
  }, [user.isLoggedIn])

  // `dispatch` garde la même référence : les callbacks mémoïsés aussi, et
  // Notifications, qui les compare, ne se redessine pas pour rien.
  // Comme dans la solution du staff, le titre et le bouton de fermeture font
  // basculer le tiroir : un clic sur « Your notifications » le referme s'il
  // est déjà ouvert.
  const handleDisplayDrawer = useCallback(() => {
    dispatch({ type: APP_ACTIONS.TOGGLE_DRAWER })
  }, [])

  const handleHideDrawer = useCallback(() => {
    dispatch({ type: APP_ACTIONS.TOGGLE_DRAWER })
  }, [])

  const logIn = useCallback((email, password) => {
    dispatch({ type: APP_ACTIONS.LOGIN, payload: { email, password } })
  }, [])

  const logOut = useCallback(() => {
    dispatch({ type: APP_ACTIONS.LOGOUT })
  }, [])

  const markNotificationAsRead = useCallback((id) => {
    console.log(`Notification ${id} has been marked as read`)
    dispatch({ type: APP_ACTIONS.MARK_NOTIFICATION_READ, payload: id })
  }, [])

  return (
    <>
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
        <Header user={user} logOut={logOut} />
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
        <Footer user={user} />
      </div>
    </>
  )
}

export default App
