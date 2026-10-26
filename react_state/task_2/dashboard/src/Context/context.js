import { createContext } from 'react'

const user = {
  email: '',
  password: '',
  isLoggedIn: false,
}

const logOut = () => {}

// Valeur lue par un consommateur placé hors de tout Provider.
const newContext = createContext({ user, logOut })

export default newContext
