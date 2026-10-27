import { useState } from 'react'

// Volontairement simple : une partie locale, une arobase, un domaine avec au
// moins un point, sans espace nulle part.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN_LENGTH = 8

// Recalculé à partir des deux valeurs à chaque frappe, pour que le bouton
// suive les champs sans décalage.
const canSubmit = (email, password) =>
  EMAIL_REGEX.test(email) && password.length >= PASSWORD_MIN_LENGTH

// État et logique du formulaire de connexion. `onLogin` reçoit l'email et le
// mot de passe saisis à la soumission : la connexion elle-même reste à App.
export default function useLogin(onLogin = () => {}) {
  const [enableSubmit, setEnableSubmit] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChangeEmail = (event) => {
    const email = event.target.value
    setFormData({ ...formData, email })
    setEnableSubmit(canSubmit(email, formData.password))
  }

  const handleChangePassword = (event) => {
    const password = event.target.value
    setFormData({ ...formData, password })
    setEnableSubmit(canSubmit(formData.email, password))
  }

  const handleLoginSubmit = (event) => {
    // Sans cela, le navigateur soumet le formulaire et recharge la page.
    event.preventDefault()
    onLogin(formData.email, formData.password)
  }

  return {
    email: formData.email,
    password: formData.password,
    enableSubmit,
    handleChangeEmail,
    handleChangePassword,
    handleLoginSubmit,
  }
}
