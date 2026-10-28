import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import Notifications from '../Notifications/Notifications'
import { user as defaultUser } from '../Context/context'
import { getLatestNotification } from '../utils/utils'

const renderApp = () => render(<App />)
const mockContextValues = []

// The password lives in App's user state but is never displayed. The Header is
// therefore wrapped with a probe that renders the real Header next to the user
// it reads from the context, which is exactly the user state App provides.
// createElement rather than JSX: a jest.mock factory may not reach the JSX
// runtime that Babel would import for it.
jest.mock('../Header/Header', () => {
  const { createElement, Fragment, useContext } = jest.requireActual('react')
  const { default: ActualHeader } = jest.requireActual('../Header/Header')
  const { default: context } = jest.requireActual('../Context/context')

  return {
    __esModule: true,
    default: function HeaderWithUserProbe() {
      const contextValue = useContext(context)
      mockContextValues.push(contextValue)
      const { user } = contextValue

      return createElement(
        Fragment,
        null,
        createElement(ActualHeader),
        createElement('output', { 'data-testid': 'user-state', hidden: true }, JSON.stringify(user))
      )
    },
  }
})

// Every set of props App renders these children with, so that their data
// types can be checked and not only what they display: the string 'true'
// opens the drawer, and the string '60' prints the same credit as 60.
const mockRenderedProps = { BodySection: [], CourseList: [], Login: [] }

// Wraps the actual component of a module with a probe that records its props
// and renders it unchanged. A function declaration is hoisted, so the jest.mock
// factories below can call it before the imports run.
function mockWithPropsProbe(name, actualModule) {
  const { createElement } = jest.requireActual('react')
  const { default: ActualComponent } = actualModule

  function PropsProbe(props) {
    mockRenderedProps[name].push(props)
    return createElement(ActualComponent, props)
  }

  return { __esModule: true, default: PropsProbe }
}

jest.mock('../BodySection/BodySection', () =>
  mockWithPropsProbe('BodySection', jest.requireActual('../BodySection/BodySection'))
)
jest.mock('../CourseList/CourseList', () =>
  mockWithPropsProbe('CourseList', jest.requireActual('../CourseList/CourseList'))
)
jest.mock('../Login/Login', () =>
  mockWithPropsProbe('Login', jest.requireActual('../Login/Login'))
)

const userState = () =>
  JSON.parse(screen.getByTestId('user-state').textContent)

describe('App', () => {
  beforeEach(() => {
    // WithLogging logs every mount and unmount of the Login form.
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error')
    jest.spyOn(console, 'warn')
    mockContextValues.length = 0
    Object.values(mockRenderedProps).forEach((props) => {
      props.length = 0
    })
  })

  afterEach(() => {
    cleanup()
    try {
      expect(console.error).not.toHaveBeenCalled()
      expect(console.warn).not.toHaveBeenCalled()
    } finally {
      jest.restoreAllMocks()
    }
  })

  // App no longer takes isLoggedIn as a prop: logging in goes through the form,
  // exactly as a visitor would.
  const logIn = async (
    email = 'user@example.com',
    password = 'secret-password'
  ) => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/email/i), email)
    await user.type(screen.getByLabelText(/password/i), password)
    await user.click(screen.getByRole('button', { name: /^ok$/i }))
  }

  test('renders an h1 with the text School dashboard', () => {
    renderApp()

    expect(
      screen.getByRole('heading', { level: 1, name: /school dashboard/i })
    ).toBeInTheDocument()
  })

  test('renders an img element', () => {
    renderApp()

    expect(screen.getByAltText(/holberton logo/i)).toBeInTheDocument()
  })

  test('renders the News from the School section by default', () => {
    renderApp()

    expect(
      screen.getByRole('heading', { name: /news from the school/i })
    ).toBeInTheDocument()
    // Le texte de cette section est le Lorem ipsum imposé par l'énoncé pour
    // éprouver le retour à la ligne ; on n'en vérifie qu'un fragment stable.
    expect(
      screen.getByText(/lorem ipsum dolor sit amet/i)
    ).toBeInTheDocument()
  })

  test('wraps the Login form in a body section titled Log in to continue', () => {
    const { container } = renderApp()

    expect(
      screen.getByRole('heading', { name: /log in to continue/i })
    ).toBeInTheDocument()
    expect(
      container.querySelectorAll('.bodySectionWithMargin')
    ).not.toHaveLength(0)
  })

  test('renders the Login form until the user logs in', () => {
    const { container } = renderApp()

    expect(
      screen.getByText(/login to access the full dashboard/i)
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^ok$/i })).toBeInTheDocument()
    expect(container.querySelector('#CourseList')).not.toBeInTheDocument()
  })

  test('renders the CourseList in place of the Login form once logged in', async () => {
    const { container } = renderApp()

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
    const { container } = renderApp()

    await logIn()

    // The section holding the table is the one carrying the bottom margin.
    const wrapper = container
      .querySelector('#CourseList')
      .closest('.bodySectionWithMargin')
    expect(wrapper).toBeInTheDocument()
  })

  // The drawer state lives in App, so the whole open/close round trip is
  // checked through the rendered page.
  test('opens the notifications drawer by default', () => {
    renderApp()

    expect(
      screen.getByText(/here is the list of notifications/i)
    ).toBeInTheDocument()
  })

  test('reopens the notifications drawer when Your notifications is clicked', () => {
    renderApp()

    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    fireEvent.click(screen.getByText(/your notifications/i))

    expect(
      screen.getByText(/here is the list of notifications/i)
    ).toBeInTheDocument()
  })

  test('closes the notifications drawer when the close button is clicked', () => {
    renderApp()

    fireEvent.click(screen.getByText(/your notifications/i))
    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(
      screen.queryByText(/here is the list of notifications/i)
    ).not.toBeInTheDocument()
  })

  describe('marking a notification as read', () => {
    test('removes the clicked item from the list and logs its id', () => {
      const { container } = renderApp()
      fireEvent.click(screen.getByText(/your notifications/i))

      fireEvent.click(screen.getByText(/new course available/i))

      expect(
        screen.queryByText(/new course available/i)
      ).not.toBeInTheDocument()
      expect(container.querySelectorAll('.notification-items li')).toHaveLength(2)
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/notification 1 has been marked as read/i)
      )
    })

    test('removes only the item that was clicked, whatever its position', () => {
      const { container } = renderApp()
      fireEvent.click(screen.getByText(/your notifications/i))

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

    test('shows the empty state once every notification is read', () => {
      const { container } = renderApp()
      fireEvent.click(screen.getByText(/your notifications/i))

      // The first item is clicked three times over: the list shifts each time.
      for (let i = 0; i < 3; i += 1) {
        fireEvent.click(container.querySelector('.notification-items li'))
      }

      expect(
        screen.getByText(/no new notification for now/i)
      ).toBeInTheDocument()
    })
  })

  describe('the Contact us link of the Footer', () => {
    test('is not displayed before logging in', () => {
      renderApp()

      expect(screen.queryByText(/contact us/i)).not.toBeInTheDocument()
    })

    test('appears once logged in and goes away after logging out', async () => {
      renderApp()

      await logIn()
      expect(
        screen.getByRole('link', { name: /contact us/i })
      ).toBeInTheDocument()

      fireEvent.click(screen.getByText(/^logout$/i))
      expect(screen.queryByText(/contact us/i)).not.toBeInTheDocument()
    })
  })

  test('keeps the notifications drawer working once logged in', async () => {
    renderApp()

    await logIn()
    fireEvent.click(screen.getByText(/your notifications/i))

    expect(
      screen.getByText(/here is the list of notifications/i)
    ).toBeInTheDocument()
  })

  // The user lives in App's state and reaches the Header through the context:
  // logging in and out must show up in both places at once.
  describe('the logout section of the Header', () => {
    test('is not rendered before logging in', () => {
      const { container } = renderApp()

      expect(container.querySelector('#logoutSection')).toBeNull()
    })

    test('welcomes the user by email once logged in', async () => {
      const { container } = renderApp()

      await logIn()

      expect(container.querySelector('#logoutSection')).toHaveTextContent(
        /welcome user@example\.com/i
      )
    })

    test('logs the user out when logout is clicked', async () => {
      const { container } = renderApp()
      await logIn()

      fireEvent.click(screen.getByText(/^logout$/i))

      expect(container.querySelector('#logoutSection')).toBeNull()
      expect(container.querySelector('#CourseList')).not.toBeInTheDocument()
      expect(
        screen.getByText(/login to access the full dashboard/i)
      ).toBeInTheDocument()
    })

    test('starts the Login form empty again after logging out', async () => {
      renderApp()
      await logIn()

      fireEvent.click(screen.getByText(/^logout$/i))

      expect(screen.getByLabelText(/email/i)).toHaveValue('')
      expect(screen.getByLabelText(/password/i)).toHaveValue('')
      expect(screen.getByRole('button', { name: /^ok$/i })).toBeDisabled()
    })
  })

  test('is a function component', () => {
    expect(typeof App).toBe('function')
    expect(App.prototype?.isReactComponent).toBeUndefined()
  })

  // Ctrl+H and its keyboard listener are gone with the class lifecycle methods.
  test('no longer logs out or alerts when ctrl and h are pressed', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    const { container } = renderApp()
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

    test('handleHideDrawer sets displayDrawer to false', () => {
      const { container } = renderApp()
      expect(drawerIsOpen(container)).toBe(true)

      fireEvent.click(screen.getByRole('button', { name: /close/i }))

      expect(drawerIsOpen(container)).toBe(false)
    })

    test('handleDisplayDrawer sets displayDrawer to true', () => {
      const { container } = renderApp()
      fireEvent.click(screen.getByRole('button', { name: /close/i }))

      fireEvent.click(screen.getByText(/your notifications/i))

      expect(drawerIsOpen(container)).toBe(true)
    })

    test('handleDisplayDrawer keeps an open drawer open', () => {
      const { container } = renderApp()

      fireEvent.click(screen.getByText(/your notifications/i))

      expect(drawerIsOpen(container)).toBe(true)
    })

    test('can be toggled again and again', () => {
      const { container } = renderApp()

      for (let i = 0; i < 2; i += 1) {
        fireEvent.click(screen.getByRole('button', { name: /close/i }))
        expect(drawerIsOpen(container)).toBe(false)
        fireEvent.click(screen.getByText(/your notifications/i))
        expect(drawerIsOpen(container)).toBe(true)
      }
    })
  })

  describe('the user state', () => {
    test('starts as the user of the context: logged out, no credentials', () => {
      renderApp()

      expect(userState()).toEqual({
        email: '',
        password: '',
        isLoggedIn: false,
      })
    })

    test('logIn sets the email, the password and isLoggedIn to true', async () => {
      renderApp()

      await logIn()

      expect(userState()).toEqual({
        email: 'user@example.com',
        password: 'secret-password',
        isLoggedIn: true,
      })
    })

    test('logOut sets isLoggedIn to false and clears the email and password', async () => {
      renderApp()
      await logIn()

      fireEvent.click(screen.getByText(/^logout$/i))

      expect(userState()).toEqual({
        email: '',
        password: '',
        isLoggedIn: false,
      })
    })

    test('logIn works again after a logOut, with the new credentials', async () => {
      renderApp()
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
    const { container } = renderApp()
    fireEvent.click(screen.getByText(/new course available/i))

    await logIn()
    fireEvent.click(screen.getByText(/^logout$/i))

    // The list is its own state: a user update leaves it untouched.
    expect(container.querySelectorAll('.notification-items li')).toHaveLength(2)
  })

  test('renders notificationsList immediately, including the latest markup', () => {
    const { container } = renderApp()
    const items = container.querySelectorAll('.notification-items li')

    expect(items).toHaveLength(3)
    expect(items[0]).toHaveTextContent('New course available')
    expect(items[1]).toHaveTextContent('New resume available')
    expect(items[2].innerHTML).toBe(getLatestNotification())
  })

  test('renders the existing courses as soon as the user logs in', async () => {
    const { container } = renderApp()

    await logIn()

    const rows = Array.from(container.querySelectorAll('#CourseList tbody tr'))
    expect(rows.map((row) => row.textContent)).toEqual([
      'ES660',
      'Webpack20',
      'React40',
    ])
  })

  test('logIn and logOut replace user without mutating previous users', async () => {
    renderApp()
    const initialUser = mockContextValues.at(-1).user
    expect(initialUser).toBe(defaultUser)

    await logIn()
    const loggedInUser = mockContextValues.at(-1).user

    expect(loggedInUser).not.toBe(initialUser)
    expect(initialUser).toEqual({ email: '', password: '', isLoggedIn: false })

    fireEvent.click(screen.getByText(/^logout$/i))

    expect(mockContextValues.at(-1).user).not.toBe(loggedInUser)
    expect(loggedInUser).toEqual({
      email: 'user@example.com',
      password: 'secret-password',
      isLoggedIn: true,
    })
    expect(userState()).toEqual({ email: '', password: '', isLoggedIn: false })
  })

  test('removes two notifications in one update without mutating the original list', () => {
    const notificationsSpy = jest.spyOn(Notifications, 'type')
    const { container } = renderApp()
    const { notifications, markNotificationAsRead } =
      notificationsSpy.mock.lastCall[0]
    const originalNotifications = notifications.map((notification) => ({ ...notification }))

    act(() => {
      markNotificationAsRead(1)
      markNotificationAsRead(2)
    })

    expect(container.querySelectorAll('.notification-items li')).toHaveLength(1)
    expect(screen.queryByText('New course available')).not.toBeInTheDocument()
    expect(screen.queryByText('New resume available')).not.toBeInTheDocument()
    expect(screen.getByText(/urgent requirement/i)).toBeInTheDocument()
    expect(notifications).toEqual(originalNotifications)
    expect(notificationsSpy.mock.lastCall[0].notifications).not.toBe(notifications)
  })

  test('keeps drawer callbacks and logOut stable across state changes', async () => {
    const notificationsSpy = jest.spyOn(Notifications, 'type')
    renderApp()
    const initialProps = notificationsSpy.mock.lastCall[0]
    const initialContext = mockContextValues.at(-1)

    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    const closedProps = notificationsSpy.mock.lastCall[0]
    expect(closedProps.displayDrawer).toBe(false)
    expect(closedProps.handleDisplayDrawer).toBe(initialProps.handleDisplayDrawer)
    expect(closedProps.handleHideDrawer).toBe(initialProps.handleHideDrawer)
    expect(closedProps.markNotificationAsRead).toBe(initialProps.markNotificationAsRead)
    expect(mockContextValues.at(-1)).toBe(initialContext)

    await logIn()

    expect(mockContextValues.at(-1).logOut).toBe(initialContext.logOut)
    fireEvent.click(screen.getByText(/your notifications/i))
    const reopenedProps = notificationsSpy.mock.lastCall[0]
    expect(reopenedProps.displayDrawer).toBe(true)
    expect(reopenedProps.handleDisplayDrawer).toBe(initialProps.handleDisplayDrawer)
    expect(reopenedProps.handleHideDrawer).toBe(initialProps.handleHideDrawer)
    expect(reopenedProps.markNotificationAsRead).toBe(initialProps.markNotificationAsRead)
  })

  test('starts a new App with all notifications after another App marks one as read', () => {
    const { unmount } = renderApp()
    fireEvent.click(screen.getByText('New course available'))

    unmount()
    const { container } = renderApp()

    expect(container.querySelectorAll('.notification-items li')).toHaveLength(3)
    expect(screen.getByText('New course available')).toBeInTheDocument()
  })

  // A value of the wrong type often renders exactly like the right one, so
  // the props App passes down are checked with toBe, toEqual and typeof
  // rather than through the page alone.
  describe('the data types of the props passed down by App', () => {
    const expectWellTypedNotifications = (notifications) => {
      expect(Array.isArray(notifications)).toBe(true)
      notifications.forEach(({ id, type, value, html }) => {
        expect(typeof id).toBe('number')
        expect(['default', 'urgent']).toContain(type)
        // An item carries either a string value or markup for
        // dangerouslySetInnerHTML, never both.
        expect(typeof (html ? html.__html : value)).toBe('string')
      })
    }

    test('Notifications gets displayDrawer as the boolean true on the first render', () => {
      const notificationsSpy = jest.spyOn(Notifications, 'type')
      renderApp()

      const [firstProps] = notificationsSpy.mock.calls[0]
      expect(firstProps.displayDrawer).toBe(true)
    })

    test('displayDrawer is the boolean false once closed and true once reopened', () => {
      const notificationsSpy = jest.spyOn(Notifications, 'type')
      renderApp()

      fireEvent.click(screen.getByRole('button', { name: /close/i }))
      expect(notificationsSpy.mock.lastCall[0].displayDrawer).toBe(false)

      fireEvent.click(screen.getByText(/your notifications/i))
      expect(notificationsSpy.mock.lastCall[0].displayDrawer).toBe(true)

      const types = notificationsSpy.mock.calls.map(
        ([props]) => typeof props.displayDrawer
      )
      expect(types).toEqual(types.map(() => 'boolean'))
    })

    test('Notifications gets the notifications array and three function callbacks', () => {
      const notificationsSpy = jest.spyOn(Notifications, 'type')
      renderApp()
      const props = notificationsSpy.mock.lastCall[0]

      expect(props.notifications).toEqual([
        { id: 1, type: 'default', value: 'New course available' },
        { id: 2, type: 'urgent', value: 'New resume available' },
        { id: 3, type: 'urgent', html: { __html: getLatestNotification() } },
      ])
      expectWellTypedNotifications(props.notifications)
      expect(typeof props.handleDisplayDrawer).toBe('function')
      expect(typeof props.handleHideDrawer).toBe('function')
      expect(typeof props.markNotificationAsRead).toBe('function')
    })

    test('the notifications keep their types once one is marked as read', () => {
      const notificationsSpy = jest.spyOn(Notifications, 'type')
      renderApp()

      fireEvent.click(screen.getByText(/new course available/i))

      const { notifications } = notificationsSpy.mock.lastCall[0]
      expect(notifications).toHaveLength(2)
      expectWellTypedNotifications(notifications)
    })

    test('CourseList gets the courses with numeric ids, string names and numeric credits', async () => {
      renderApp()

      await logIn()

      const { courses } = mockRenderedProps.CourseList.at(-1)
      expect(Array.isArray(courses)).toBe(true)
      expect(courses).toEqual([
        { id: 1, name: 'ES6', credit: 60 },
        { id: 2, name: 'Webpack', credit: 20 },
        { id: 3, name: 'React', credit: 40 },
      ])
      courses.forEach(({ id, name, credit }) => {
        expect(typeof id).toBe('number')
        expect(typeof name).toBe('string')
        expect(typeof credit).toBe('number')
      })
    })

    test('Login gets a logIn function and string credentials, before and after a logout', async () => {
      const expectWellTypedLoginProps = ({ logIn: logInProp, email, password }) => {
        expect(typeof logInProp).toBe('function')
        // Login keeps its own form state: the credentials it gets from App
        // are optional, but they are strings whenever they are passed.
        expect(['undefined', 'string']).toContain(typeof email)
        expect(['undefined', 'string']).toContain(typeof password)
      }
      renderApp()
      expectWellTypedLoginProps(mockRenderedProps.Login.at(-1))

      await logIn()
      fireEvent.click(screen.getByText(/^logout$/i))

      expectWellTypedLoginProps(mockRenderedProps.Login.at(-1))
    })

    test('every body section gets a string title', async () => {
      renderApp()
      await logIn()

      const titles = mockRenderedProps.BodySection.map(({ title }) => title)
      expect(titles).toEqual(
        expect.arrayContaining(['Log in to continue', 'Course list', 'News from the School'])
      )
      expect(titles.map((title) => typeof title)).toEqual(
        titles.map(() => 'string')
      )
    })

    test('the context gets a user of strings and a boolean, and a logOut function', async () => {
      renderApp()
      await logIn()
      expect(mockContextValues.at(-1).user).toStrictEqual({
        email: 'user@example.com',
        password: 'secret-password',
        isLoggedIn: true,
      })

      fireEvent.click(screen.getByText(/^logout$/i))
      expect(mockContextValues.at(-1).user).toStrictEqual({
        email: '',
        password: '',
        isLoggedIn: false,
      })

      mockContextValues.forEach(({ user, logOut }) => {
        expect(typeof user.email).toBe('string')
        expect(typeof user.password).toBe('string')
        expect(typeof user.isLoggedIn).toBe('boolean')
        expect(typeof logOut).toBe('function')
      })
    })
  })
})
