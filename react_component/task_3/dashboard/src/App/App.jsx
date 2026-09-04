import { Component, Fragment } from 'react'
import './App.css'
import Notifications from '../Notifications/Notifications'
import Header from '../Header/Header'
import Login from '../Login/Login'
import Footer from '../Footer/Footer'
import CourseList from '../CourseList/CourseList'
import { getLatestNotification } from '../utils/utils'

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
    const hasCtrlKey = 'ctrlKey' in event
    const hasKey = 'key' in event
    const key = hasKey ? event.key : ''

    if (hasCtrlKey && event.ctrlKey && key.toLowerCase() === 'h') {
      window.alert('Logging you out')
      this.props.logOut()
    }
  }

  render() {
    const { isLoggedIn } = this.props
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

    return (
      <Fragment>
        <div className="root-notifications">
          <Notifications notifications={notificationsList} />
        </div>
        <Header />
        {isLoggedIn ? (
          <main className="App-main">
            <CourseList courses={coursesList} />
          </main>
        ) : (
          <Login />
        )}
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
