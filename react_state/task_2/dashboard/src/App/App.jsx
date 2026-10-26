import { Component } from 'react'
import Notifications from '../Notifications/Notifications'
import Header from '../Header/Header'
import Login from '../Login/Login'
import CourseList from '../CourseList/CourseList'
import Footer from '../Footer/Footer'
import BodySection from '../BodySection/BodySection'
import BodySectionWithMarginBottom from '../BodySection/BodySectionWithMarginBottom'
import newContext from '../Context/context'
import { getLatestNotification } from '../utils/utils'

// Nommé en capitale : ESLint, sans plugin React, ne reconnaît comme utilisée
// en JSX qu'une variable qui commence par une majuscule.
const ContextProvider = newContext.Provider

const listNotifications = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', html: { __html: getLatestNotification() } },
]

const listCourses = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
  { id: 3, name: 'React', credit: 40 },
]

// Même forme que l'utilisateur par défaut du contexte : c'est l'état d'un
// visiteur non connecté, auquel la déconnexion revient.
const defaultUser = {
  email: '',
  password: '',
  isLoggedIn: false,
}

class App extends Component {
  constructor(props) {
    super(props)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleDisplayDrawer = this.handleDisplayDrawer.bind(this)
    this.handleHideDrawer = this.handleHideDrawer.bind(this)
    this.logIn = this.logIn.bind(this)
    this.logOut = this.logOut.bind(this)
    // Le tiroir est fermé au chargement : c'est un clic sur « Your
    // notifications » qui l'ouvre.
    this.state = {
      displayDrawer: false,
      user: defaultUser,
      logOut: this.logOut,
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown(event) {
    // A synthetic event may carry neither key, hence the checks before reading them.
    const hasCtrlKey = 'ctrlKey' in event && event.ctrlKey
    const key = 'key' in event ? String(event.key) : ''

    if (hasCtrlKey && key.toLowerCase() === 'h') {
      window.alert('Logging you out')
      this.state.logOut()
    }
  }

  handleDisplayDrawer() {
    this.setState({ displayDrawer: true })
  }

  handleHideDrawer() {
    this.setState({ displayDrawer: false })
  }

  logIn(email, password) {
    this.setState({ user: { email, password, isLoggedIn: true } })
  }

  logOut() {
    this.setState({ user: defaultUser })
  }

  // Le Provider compare sa valeur par référence : un objet recréé à chaque
  // rendu ferait re-rendre tous ses consommateurs, même quand seul le tiroir
  // bouge. L'objet n'est donc reconstruit que si l'utilisateur a changé.
  getContextValue() {
    const { user, logOut } = this.state

    if (
      !this.contextValue ||
      this.contextValue.user !== user ||
      this.contextValue.logOut !== logOut
    ) {
      this.contextValue = { user, logOut }
    }
    return this.contextValue
  }

  render() {
    const { displayDrawer, user } = this.state

    return (
      <ContextProvider value={this.getContextValue()}>
        {/* Conteneur de l'application : une colonne flex d'au moins une
            hauteur d'écran, ce qui laisse le pied de page se coller en bas, et
            l'ancrage `relative` du panneau de notifications. */}
        <div className="relative flex min-h-screen flex-col px-3">
          <div className="root-notifications">
            {/* L'ouverture du tiroir est un état d'App : Notifications
                l'affiche et signale les clics par ces deux callbacks. */}
            <Notifications
              notifications={listNotifications}
              displayDrawer={displayDrawer}
              handleDisplayDrawer={this.handleDisplayDrawer}
              handleHideDrawer={this.handleHideDrawer}
            />
          </div>
          <Header />
          <div className="App-body pt-[38px]">
            {user.isLoggedIn ? (
              <BodySectionWithMarginBottom title="Course list">
                <CourseList courses={listCourses} />
              </BodySectionWithMarginBottom>
            ) : (
              <BodySectionWithMarginBottom title="Log in to continue">
                <Login
                  logIn={this.logIn}
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
}

export default App
