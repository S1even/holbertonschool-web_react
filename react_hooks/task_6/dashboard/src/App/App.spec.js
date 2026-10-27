import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import mockAxios from 'jest-mock-axios'
import App from './App'
import { getLatestNotification } from '../utils/utils'

const NOTIFICATIONS_URL = 'http://localhost:5173/notifications.json'
const COURSES_URL = 'http://localhost:5173/courses.json'

// The same data as public/notifications.json and public/courses.json.
const notificationsResponse = {
  data: {
    notifications: [
      { id: 1, type: 'default', value: 'New course available' },
      { id: 2, type: 'urgent', value: 'New resume available' },
      { id: 3, type: 'urgent', html: { __html: '' } },
    ],
  },
}

const coursesResponse = {
  data: {
    courses: [
      { id: 1, name: 'ES6', credit: 60 },
      { id: 2, name: 'Webpack', credit: 20 },
      { id: 3, name: 'React', credit: 40 },
    ],
  },
}

// Answers the pending request for a URL, inside act so React applies the
// state update the response triggers before the test goes on.
const respond = async (url, response) => {
  await act(async () => {
    mockAxios.mockResponseFor({ url }, response)
  })
}

// Renders App the way it starts in a browser: the notifications arrive from
// the server right after the first render.
const renderApp = async () => {
  const result = render(<App />)
  await respond(NOTIFICATIONS_URL, notificationsResponse)
  return result
}

// The password lives in App's user state but is never displayed. The Header is
// therefore wrapped with a probe that renders the real Header next to the
// `user` prop it receives, which is exactly the user state App holds.
// createElement rather than JSX: a jest.mock factory may not reach the JSX
// runtime that Babel would import for it.
jest.mock('../Header/Header', () => {
  const { createElement, Fragment } = jest.requireActual('react')
  const { default: ActualHeader } = jest.requireActual('../Header/Header')

  return {
    __esModule: true,
    default: function HeaderWithUserProbe(props) {
      return createElement(
        Fragment,
        null,
        createElement(ActualHeader, props),
        createElement(
          'output',
          { 'data-testid': 'user-state', hidden: true },
          JSON.stringify(props.user)
        )
      )
    },
  }
})

const userState = () =>
  JSON.parse(screen.getByTestId('user-state').textContent)

describe('App', () => {
  beforeEach(() => {
    // WithLogging logs every mount and unmount of the Login form.
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    // Drops the requests a test left unanswered, and their call history.
    mockAxios.reset()
    jest.restoreAllMocks()
  })

  // App no longer takes isLoggedIn as a prop: logging in goes through the form,
  // exactly as a visitor would. The courses are then served for the new user.
  const logIn = async (
    email = 'user@example.com',
    password = 'secret-password'
  ) => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/email/i), email)
    await user.type(screen.getByLabelText(/password/i), password)
    await user.click(screen.getByRole('button', { name: /^ok$/i }))
    await respond(COURSES_URL, coursesResponse)
  }

  test('renders an h1 with the text School dashboard', async () => {
    await renderApp()

    expect(
      screen.getByRole('heading', { level: 1, name: /school dashboard/i })
    ).toBeInTheDocument()
  })

  test('renders an img element', async () => {
    await renderApp()

    expect(screen.getByAltText(/holberton logo/i)).toBeInTheDocument()
  })

  test('renders the News from the School section by default', async () => {
    await renderApp()

    expect(
      screen.getByRole('heading', { name: /news from the school/i })
    ).toBeInTheDocument()
    // Le texte de cette section est le Lorem ipsum imposé par l'énoncé pour
    // éprouver le retour à la ligne ; on n'en vérifie qu'un fragment stable.
    expect(
      screen.getByText(/lorem ipsum dolor sit amet/i)
    ).toBeInTheDocument()
  })

  test('wraps the Login form in a body section titled Log in to continue', async () => {
    const { container } = await renderApp()

    expect(
      screen.getByRole('heading', { name: /log in to continue/i })
    ).toBeInTheDocument()
    expect(
      container.querySelectorAll('.bodySectionWithMargin')
    ).not.toHaveLength(0)
  })

  test('renders the Login form until the user logs in', async () => {
    const { container } = await renderApp()

    expect(
      screen.getByText(/login to access the full dashboard/i)
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^ok$/i })).toBeInTheDocument()
    expect(container.querySelector('#CourseList')).not.toBeInTheDocument()
  })

  test('renders the CourseList in place of the Login form once logged in', async () => {
    const { container } = await renderApp()

    await logIn()

    expect(container.querySelector('#CourseList')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /course list/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/available courses/i)).toBeInTheDocument()
    expect(
      screen.queryByText(/login to access the full dashboard/i)
    ).not.toBeInTheDocument()
  })

  test('wraps the CourseList in a body section titled Course list', async () => {
    const { container } = await renderApp()

    await logIn()

    // The section holding the table is the one carrying the bottom margin.
    const wrapper = container
      .querySelector('#CourseList')
      .closest('.bodySectionWithMargin')
    expect(wrapper).toBeInTheDocument()
  })

  // The drawer state lives in App, so the whole open/close round trip is
  // checked through the rendered page.
  test('opens the notifications drawer by default', async () => {
    await renderApp()

    expect(
      screen.getByText(/here is the list of notifications/i)
    ).toBeInTheDocument()
  })

  test('reopens the notifications drawer when Your notifications is clicked', async () => {
    await renderApp()

    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    fireEvent.click(screen.getByText(/your notifications/i))

    expect(
      screen.getByText(/here is the list of notifications/i)
    ).toBeInTheDocument()
  })

  test('closes the notifications drawer when the close button is clicked', async () => {
    await renderApp()

    // The drawer is open on load: the close button is there right away.
    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(
      screen.queryByText(/here is the list of notifications/i)
    ).not.toBeInTheDocument()
  })

  describe('marking a notification as read', () => {
    test('removes the clicked item from the list and logs its id', async () => {
      const { container } = await renderApp()

      fireEvent.click(screen.getByText(/new course available/i))

      expect(
        screen.queryByText(/new course available/i)
      ).not.toBeInTheDocument()
      expect(container.querySelectorAll('.notification-items li')).toHaveLength(2)
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/notification 1 has been marked as read/i)
      )
    })

    test('removes only the item that was clicked, whatever its position', async () => {
      const { container } = await renderApp()

      fireEvent.click(screen.getByText(/new resume available/i))

      const remaining = Array.from(
        container.querySelectorAll('.notification-items li')
      )
      expect(remaining).toHaveLength(2)
      expect(remaining[0]).toHaveTextContent(/new course available/i)
      expect(remaining[1]).toHaveTextContent(/urgent requirement/i)
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/notification 2 has been marked as read/i)
      )
    })

    test('shows the empty state once every notification is read', async () => {
      const { container } = await renderApp()

      // The first item is clicked three times over: the list shifts each time.
      for (let i = 0; i < 3; i += 1) {
        fireEvent.click(container.querySelector('.notification-items li'))
      }

      expect(
        screen.getByText(/no new notifications for now/i)
      ).toBeInTheDocument()
    })
  })

  describe('the Contact us link of the Footer', () => {
    test('is not displayed before logging in', async () => {
      await renderApp()

      expect(screen.queryByText(/contact us/i)).not.toBeInTheDocument()
    })

    test('appears once logged in and goes away after logging out', async () => {
      await renderApp()

      await logIn()
      expect(
        screen.getByRole('link', { name: /contact us/i })
      ).toBeInTheDocument()

      fireEvent.click(screen.getByText(/^logout$/i))
      expect(screen.queryByText(/contact us/i)).not.toBeInTheDocument()
    })
  })

  test('keeps the notifications drawer working once logged in', async () => {
    await renderApp()

    await logIn()
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    fireEvent.click(screen.getByText(/your notifications/i))

    expect(
      screen.getByText(/here is the list of notifications/i)
    ).toBeInTheDocument()
  })

  // The user lives in App's state and reaches the Header through the context:
  // logging in and out must show up in both places at once.
  describe('the logout section of the Header', () => {
    test('is not rendered before logging in', async () => {
      const { container } = await renderApp()

      expect(container.querySelector('#logoutSection')).toBeNull()
    })

    test('welcomes the user by email once logged in', async () => {
      const { container } = await renderApp()

      await logIn()

      expect(container.querySelector('#logoutSection')).toHaveTextContent(
        /welcome user@example\.com/i
      )
    })

    test('logs the user out when logout is clicked', async () => {
      const { container } = await renderApp()
      await logIn()

      fireEvent.click(screen.getByText(/^logout$/i))

      expect(container.querySelector('#logoutSection')).toBeNull()
      expect(container.querySelector('#CourseList')).not.toBeInTheDocument()
      expect(
        screen.getByText(/login to access the full dashboard/i)
      ).toBeInTheDocument()
    })

    test('starts the Login form empty again after logging out', async () => {
      await renderApp()
      await logIn()

      fireEvent.click(screen.getByText(/^logout$/i))

      expect(screen.getByLabelText(/email/i)).toHaveValue('')
      expect(screen.getByLabelText(/password/i)).toHaveValue('')
      expect(screen.getByRole('button', { name: /^ok$/i })).toBeDisabled()
    })
  })

  test('is a function component', async () => {
    expect(typeof App).toBe('function')
    expect(App.prototype?.isReactComponent).toBeUndefined()
  })

  // Ctrl+H and its keyboard listener are gone with the class lifecycle methods.
  test('no longer logs out or alerts when ctrl and h are pressed', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    const { container } = await renderApp()
    await logIn()

    fireEvent.keyDown(document, { key: 'h', ctrlKey: true })

    expect(alertSpy).not.toHaveBeenCalled()
    expect(container.querySelector('#CourseList')).toBeInTheDocument()
  })

  // handleDisplayDrawer and handleHideDrawer reach the drawer as callbacks:
  // their effect is read on the displayDrawer state, through the page.
  describe('handleDisplayDrawer and handleHideDrawer', () => {
    const drawerIsOpen = (container) =>
      container.querySelector('.notification-items') !== null

    test('handleHideDrawer sets displayDrawer to false', async () => {
      const { container } = await renderApp()
      expect(drawerIsOpen(container)).toBe(true)

      fireEvent.click(screen.getByRole('button', { name: /close/i }))

      expect(drawerIsOpen(container)).toBe(false)
    })

    test('handleDisplayDrawer sets displayDrawer to true', async () => {
      const { container } = await renderApp()
      fireEvent.click(screen.getByRole('button', { name: /close/i }))

      fireEvent.click(screen.getByText(/your notifications/i))

      expect(drawerIsOpen(container)).toBe(true)
    })

    // Both callbacks dispatch TOGGLE_DRAWER: the title flips the drawer too.
    test('handleDisplayDrawer closes a drawer that is already open', async () => {
      const { container } = await renderApp()

      fireEvent.click(screen.getByText(/your notifications/i))

      expect(drawerIsOpen(container)).toBe(false)
    })

    test('toggles the empty drawer before the server has answered', () => {
      render(<App />)
      const title = screen.getByText(/your notifications/i)

      expect(screen.getByText(/no new notifications for now/i)).toBeInTheDocument()
      fireEvent.click(title)
      expect(screen.queryByText(/no new notifications for now/i)).toBeNull()
      fireEvent.click(title)
      expect(screen.getByText(/no new notifications for now/i)).toBeInTheDocument()
    })

    test('the title alone opens and closes the drawer in turn', async () => {
      const { container } = await renderApp()
      const title = screen.getByText(/your notifications/i)

      fireEvent.click(title)
      expect(drawerIsOpen(container)).toBe(false)
      fireEvent.click(title)
      expect(drawerIsOpen(container)).toBe(true)
    })

    test('can be toggled again and again', async () => {
      const { container } = await renderApp()

      for (let i = 0; i < 2; i += 1) {
        fireEvent.click(screen.getByRole('button', { name: /close/i }))
        expect(drawerIsOpen(container)).toBe(false)
        fireEvent.click(screen.getByText(/your notifications/i))
        expect(drawerIsOpen(container)).toBe(true)
      }
    })
  })

  describe('the user state', () => {
    test('starts as the user of the context: logged out, no credentials', async () => {
      await renderApp()

      expect(userState()).toEqual({
        email: '',
        password: '',
        isLoggedIn: false,
      })
    })

    test('logIn sets the email, the password and isLoggedIn to true', async () => {
      await renderApp()

      await logIn()

      expect(userState()).toEqual({
        email: 'user@example.com',
        password: 'secret-password',
        isLoggedIn: true,
      })
    })

    test('logOut sets isLoggedIn to false and clears the email and password', async () => {
      await renderApp()
      await logIn()

      fireEvent.click(screen.getByText(/^logout$/i))

      expect(userState()).toEqual({
        email: '',
        password: '',
        isLoggedIn: false,
      })
    })

    test('logIn works again after a logOut, with the new credentials', async () => {
      await renderApp()
      await logIn()
      fireEvent.click(screen.getByText(/^logout$/i))

      await logIn('other@example.com', 'other-password')

      expect(userState()).toEqual({
        email: 'other@example.com',
        password: 'other-password',
        isLoggedIn: true,
      })
    })
  })

  test('keeps the notifications when the user logs in and out', async () => {
    const { container } = await renderApp()
    fireEvent.click(screen.getByText(/new course available/i))

    await logIn()
    fireEvent.click(screen.getByText(/^logout$/i))

    // The list is its own state: a user update leaves it untouched.
    expect(container.querySelectorAll('.notification-items li')).toHaveLength(2)
  })

  describe('fetching the notifications', () => {
    test('requests notifications.json once, when App first renders', () => {
      render(<App />)

      expect(mockAxios.get).toHaveBeenCalledTimes(1)
      expect(mockAxios.get).toHaveBeenCalledWith(NOTIFICATIONS_URL)
    })

    test('shows no notification until the server has answered', () => {
      render(<App />)

      expect(
        screen.getByText(/no new notifications for now/i)
      ).toBeInTheDocument()
    })

    test('renders the notifications retrieved from the server', async () => {
      const { container } = await renderApp()

      const items = Array.from(container.querySelectorAll('.notification-items li'))
      expect(items).toHaveLength(3)
      expect(items[0]).toHaveTextContent(/new course available/i)
      expect(items[1]).toHaveTextContent(/new resume available/i)
    })

    test('fills the latest notification with getLatestNotification()', async () => {
      const { container } = await renderApp()

      const latest = container.querySelectorAll('.notification-items li')[2]
      expect(latest.innerHTML).toBe(getLatestNotification())
      expect(latest.querySelector('strong')).toBeInTheDocument()
    })

    test('does not request the notifications again on later renders', async () => {
      await renderApp()

      fireEvent.click(screen.getByRole('button', { name: /close/i }))
      fireEvent.click(screen.getByText(/your notifications/i))
      await logIn()

      const notificationCalls = mockAxios.get.mock.calls.filter(
        ([url]) => url === NOTIFICATIONS_URL
      )
      expect(notificationCalls).toHaveLength(1)
    })

    test('logs the error and keeps an empty list when the request fails', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      render(<App />)

      await act(async () => {
        mockAxios.mockError(new Error('Network Error'))
      })

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringMatching(/error fetching notifications/i),
        expect.any(Error)
      )
      expect(
        screen.getByText(/no new notifications for now/i)
      ).toBeInTheDocument()
    })

    test('ignores a response that arrives after App is unmounted', async () => {
      const errorSpy = jest.spyOn(console, 'error')
      const { unmount } = render(<App />)

      unmount()
      await respond(NOTIFICATIONS_URL, notificationsResponse)

      expect(errorSpy).not.toHaveBeenCalled()
    })
  })

  describe('fetching the courses', () => {
    const courseRequests = () =>
      mockAxios.get.mock.calls.filter(([url]) => url === COURSES_URL)

    test('does not request the courses while the user is logged out', async () => {
      await renderApp()

      expect(courseRequests()).toHaveLength(0)
    })

    test('requests courses.json when the user logs in', async () => {
      await renderApp()

      await logIn()

      expect(courseRequests()).toHaveLength(1)
    })

    test('renders the courses retrieved from the server', async () => {
      const { container } = await renderApp()

      await logIn()

      const rows = Array.from(container.querySelectorAll('#CourseList tbody tr'))
      expect(rows.map((row) => row.textContent)).toEqual([
        'ES660',
        'Webpack20',
        'React40',
      ])
    })

    test('requests the courses again on each new login', async () => {
      await renderApp()
      await logIn()
      fireEvent.click(screen.getByText(/^logout$/i))

      await logIn('other@example.com', 'other-password')

      expect(courseRequests()).toHaveLength(2)
    })

    test('empties the courses when the user logs out', async () => {
      const { container } = await renderApp()
      await logIn()
      fireEvent.click(screen.getByText(/^logout$/i))

      // Logging in again shows an empty table until the server answers.
      const user = userEvent.setup()
      await user.type(screen.getByLabelText(/email/i), 'user@example.com')
      await user.type(screen.getByLabelText(/password/i), 'secret-password')
      await user.click(screen.getByRole('button', { name: /^ok$/i }))

      expect(container.querySelectorAll('#CourseList tbody tr')).toHaveLength(0)
      expect(screen.getByText(/no course available yet/i)).toBeInTheDocument()
    })

    test('logs the error and keeps an empty table when the request fails', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      await renderApp()
      const user = userEvent.setup()
      await user.type(screen.getByLabelText(/email/i), 'user@example.com')
      await user.type(screen.getByLabelText(/password/i), 'secret-password')
      await user.click(screen.getByRole('button', { name: /^ok$/i }))

      await act(async () => {
        mockAxios.mockError(new Error('Network Error'))
      })

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringMatching(/error fetching courses/i),
        expect.any(Error)
      )
      expect(screen.getByText(/no course available yet/i)).toBeInTheDocument()
    })

    test('ignores courses that arrive after the user logged out', async () => {
      const { container } = await renderApp()
      const user = userEvent.setup()
      await user.type(screen.getByLabelText(/email/i), 'user@example.com')
      await user.type(screen.getByLabelText(/password/i), 'secret-password')
      await user.click(screen.getByRole('button', { name: /^ok$/i }))
      fireEvent.click(screen.getByText(/^logout$/i))

      await respond(COURSES_URL, coursesResponse)
      await logIn()
      // The previous answer was dropped: only the new one fills the table.
      expect(container.querySelectorAll('#CourseList tbody tr')).toHaveLength(3)
    })
  })

  // The reducer is exercised through the page, as a visitor drives it: each
  // interaction dispatches an action, and the UI shows the new state.
  describe('the state held by the reducer', () => {
    test('starts with the drawer open, a logged-out user and no data', () => {
      const { container } = render(<App />)

      expect(container.querySelector('.notification-items')).toBeInTheDocument()
      expect(userState()).toEqual({ email: '', password: '', isLoggedIn: false })
      expect(container.querySelectorAll('.notification-items li')).toHaveLength(0)
    })

    test('LOGIN reaches the Header and the Footer through their props', async () => {
      const { container } = await renderApp()

      await logIn()

      expect(container.querySelector('#logoutSection')).toHaveTextContent(
        /welcome user@example\.com/i
      )
      expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument()
    })

    test('LOGOUT resets the user and empties the courses', async () => {
      const { container } = await renderApp()
      await logIn()
      expect(container.querySelectorAll('#CourseList tbody tr')).toHaveLength(3)

      fireEvent.click(screen.getByText(/^logout$/i))

      expect(userState()).toEqual({ email: '', password: '', isLoggedIn: false })
      expect(container.querySelector('#CourseList')).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /contact us/i })).not.toBeInTheDocument()
    })

    test('TOGGLE_DRAWER closes and reopens the drawer', async () => {
      const { container } = await renderApp()

      fireEvent.click(screen.getByRole('button', { name: /close/i }))
      expect(container.querySelector('.notification-items')).toBeNull()

      fireEvent.click(screen.getByText(/your notifications/i))
      expect(container.querySelector('.notification-items')).toBeInTheDocument()
    })

    test('MARK_NOTIFICATION_READ leaves the server response untouched', async () => {
      const { container } = await renderApp()

      fireEvent.click(screen.getByText(/new course available/i))

      expect(container.querySelectorAll('.notification-items li')).toHaveLength(2)
      // A new list is computed: the array received from the server is kept.
      expect(notificationsResponse.data.notifications).toHaveLength(3)
    })

    test('SET_COURSES fills the table with the courses of the response', async () => {
      const { container } = await renderApp()

      await logIn()

      expect(
        Array.from(container.querySelectorAll('#CourseList tbody td:first-child')).map(
          (cell) => cell.textContent
        )
      ).toEqual(['ES6', 'Webpack', 'React'])
    })
  })
})
