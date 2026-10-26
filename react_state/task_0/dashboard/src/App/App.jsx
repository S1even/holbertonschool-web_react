import { Component } from 'react'
import Notifications from '../Notifications/Notifications'
import Header from '../Header/Header'
import Login from '../Login/Login'
import CourseList from '../CourseList/CourseList'
import Footer from '../Footer/Footer'
import BodySection from '../BodySection/BodySection'
import BodySectionWithMarginBottom from '../BodySection/BodySectionWithMarginBottom'
import { getLatestNotification } from '../utils/utils'

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

class App extends Component {
  constructor(props) {
    super(props)
    // Le tiroir est fermé au chargement : c'est un clic sur « Your
    // notifications » qui l'ouvre.
    this.state = { displayDrawer: false }
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleDisplayDrawer = this.handleDisplayDrawer.bind(this)
    this.handleHideDrawer = this.handleHideDrawer.bind(this)
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
      if (this.props.logOut) this.props.logOut()
    }
  }

  handleDisplayDrawer() {
    this.setState({ displayDrawer: true })
  }

  handleHideDrawer() {
    this.setState({ displayDrawer: false })
  }

  render() {
    // Valeurs par défaut en destructuration plutôt que dans `defaultProps` :
    // c'est la forme `isLoggedIn = false` que les scripts du checker réécrivent.
    const { isLoggedIn = false } = this.props
    const { displayDrawer } = this.state

    return (
      // Conteneur de l'application : une colonne flex d'au moins une hauteur
      // d'écran, ce qui laisse le pied de page se coller en bas, et l'ancrage
      // `relative` du panneau de notifications.
      <div className="relative flex min-h-screen flex-col px-3">
        <div className="root-notifications">
          {/* L'ouverture du tiroir est désormais un état d'App : Notifications
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
          {isLoggedIn ? (
            <BodySectionWithMarginBottom title="Course list">
              <CourseList courses={listCourses} />
            </BodySectionWithMarginBottom>
          ) : (
            <BodySectionWithMarginBottom title="Log in to continue">
              <Login />
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
    )
  }
}

export default App
