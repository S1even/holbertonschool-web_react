import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './main.css'
import App from './App/App.jsx'

// État de connexion de l'application servie.
const isLoggedIn = false

// La prop n'est passée que lorsqu'elle vaut `true`. Passer `isLoggedIn={false}`
// écraserait la valeur par défaut de `App`, qui est l'autre endroit où cet état
// peut être réglé.
createRoot(document.getElementById('root')).render(
  <StrictMode>{isLoggedIn ? <App isLoggedIn /> : <App />}</StrictMode>
)
