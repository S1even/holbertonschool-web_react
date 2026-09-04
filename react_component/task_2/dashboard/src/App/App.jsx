import { Component, Fragment } from 'react'
import './App.css'
import Notifications from '../Notifications/Notifications'
import Header from '../Header/Header'
import Login from '../Login/Login'
import CourseList from '../CourseList/CourseList'
import Footer from '../Footer/Footer'
import { getLatestNotification } from '../utils/utils'

const notificationsList = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', value: { __html: getLatestNotification() } },
]

const coursesList = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
  { id: 3, name: 'React', credit: 40 },
]

class App extends Component {
  constructor(props) {
    super(props)
    this.handleKeyDown = this.handleKeyDown.bind(this)
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
      this.props.logOut()
    }
  }

  render() {
    const { isLoggedIn } = this.props

    return (
      <Fragment>
        <div className="root-notifications">
          <Notifications notifications={notificationsList} />
        </div>
        <Header />
        <div className="App-body">
          {isLoggedIn ? <CourseList courses={coursesList} /> : <Login />}
        </div>
        <Footer />
      </Fragment>
    )
  }
}

App.defaultProps = {
  isLoggedIn: false,
  logOut: () => {},
}

export default App
