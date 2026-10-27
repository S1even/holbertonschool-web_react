import { createContext } from 'react'

// Exportés pour qu'App initialise son état avec ce même utilisateur.
export const user = {
  email: '',
  password: '',
  isLoggedIn: false,
}

export const logOut = () => {}

// Valeur lue par un consommateur placé hors de tout Provider.
const newContext = createContext({ user, logOut })

export default newContext
