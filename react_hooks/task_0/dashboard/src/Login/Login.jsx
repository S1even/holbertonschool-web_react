import { Component } from 'react'
import WithLogging from '../HOC/WithLogging'

// Volontairement simple : une partie locale, une arobase, un domaine avec au
// moins un point, sans espace nulle part.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN_LENGTH = 8

class Login extends Component {
  constructor(props) {
    super(props)
    // Les champs démarrent sur les identifiants reçus d'App ; le bouton suit
    // la même règle que pendant la saisie, donc reste désactivé à vide.
    const { email = '', password = '' } = props
    this.state = {
      email,
      password,
      enableSubmit: Login.canSubmit(email, password),
    }
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this)
    this.handleChangeEmail = this.handleChangeEmail.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
  }

  // Recalculé à partir des deux valeurs à chaque frappe, pour que le bouton
  // suive les champs sans décalage.
  static canSubmit(email, password) {
    return EMAIL_REGEX.test(email) && password.length >= PASSWORD_MIN_LENGTH
  }

  handleLoginSubmit(event) {
    // Sans cela, le navigateur soumet le formulaire et recharge la page.
    event.preventDefault()
    // La connexion appartient à App : Login se contente de lui transmettre
    // les identifiants saisis.
    const { logIn = () => {} } = this.props
    const { email, password } = this.state
    logIn(email, password)
  }

  handleChangeEmail(event) {
    const email = event.target.value
    this.setState(({ password }) => ({
      email,
      enableSubmit: Login.canSubmit(email, password),
    }))
  }

  handleChangePassword(event) {
    const password = event.target.value
    this.setState(({ email }) => ({
      password,
      enableSubmit: Login.canSubmit(email, password),
    }))
  }

  render() {
    const { email, password, enableSubmit } = this.state

    return (
      <div className="App-login border-t-4 border-(--main-color) h-120 max-[912px]:h-115 pt-5 pl-10 text-lg max-[912px]:pl-1">
        <p className="text-xl mb-8">
          Login to access the full dashboard
        </p>
        {/* Rangée sur grand écran ; sur mobile chaque étiquette passe au-dessus
            de son champ, d'où la colonne et l'alignement à gauche. */}
        <form
          onSubmit={this.handleLoginSubmit}
          className="flex items-center gap-2 max-[912px]:flex-col max-[912px]:gap-0 max-[912px]:items-start"
        >
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={this.handleChangeEmail}
            className="border border-black rounded-xs px-2 py-0 max-[912px]:w-60 max-[912px]:mb-1.5"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={this.handleChangePassword}
            className="border border-black rounded-xs px-2 py-0 max-[912px]:w-60 max-[912px]:mb-1.5"
          />
          <input
            type="submit"
            value="OK"
            disabled={!enableSubmit}
            className="border border-black rounded-xs px-1 py-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          />
        </form>
      </div>
    )
  }
}

// Exported wrapped, so every mount and unmount of the form is logged.
const LoginWithLogging = WithLogging(Login)

export default LoginWithLogging
