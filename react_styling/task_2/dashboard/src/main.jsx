import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './main.css'
import App from './App/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* isLoggedIn à true : c'est la table des cours qu'on veut afficher ici,
        pas le formulaire de connexion. */}
    <App isLoggedIn={true} />
  </StrictMode>,
)
