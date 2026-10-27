// Toutes les transitions d'état d'App passent par ces actions.
export const APP_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  TOGGLE_DRAWER: 'TOGGLE_DRAWER',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  SET_COURSES: 'SET_COURSES',
}

// Un visiteur non connecté, celui auquel la déconnexion revient.
const loggedOutUser = {
  email: '',
  password: '',
  isLoggedIn: false,
}

// Le tiroir est ouvert au chargement ; notifications et cours arrivent du
// serveur.
export const initialState = {
  displayDrawer: true,
  user: loggedOutUser,
  notifications: [],
  courses: [],
}

// Chaque cas renvoie un nouvel objet : l'état reçu n'est jamais modifié.
export function appReducer(state = initialState, action) {
  switch (action.type) {
    case APP_ACTIONS.LOGIN:
      return {
        ...state,
        user: {
          email: action.payload.email,
          password: action.payload.password,
          isLoggedIn: true,
        },
      }

    // Les cours appartiennent à l'utilisateur connecté : ils partent avec lui.
    case APP_ACTIONS.LOGOUT:
      return { ...state, user: loggedOutUser, courses: [] }

    case APP_ACTIONS.TOGGLE_DRAWER:
      return { ...state, displayDrawer: !state.displayDrawer }

    case APP_ACTIONS.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
      }

    case APP_ACTIONS.SET_NOTIFICATIONS:
      return { ...state, notifications: action.payload }

    case APP_ACTIONS.SET_COURSES:
      return { ...state, courses: action.payload }

    default:
      return state
  }
}

export default appReducer
