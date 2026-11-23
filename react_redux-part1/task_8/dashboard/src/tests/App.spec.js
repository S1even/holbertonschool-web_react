import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import App from '../App';
import authReducer from '../features/auth/authSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import coursesReducer from '../features/courses/coursesSlice';

const notificationsData = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', html: { __html: '' } },
];

const coursesData = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
  { id: 3, name: 'React', credit: 40 },
];

const createMockStore = (isLoggedIn = false) =>
  configureStore({
    reducer: {
      auth: authReducer,
      notifications: notificationsReducer,
      courses: coursesReducer,
    },
    preloadedState: {
      auth: {
        user: {
          email: isLoggedIn ? 'test@test.com' : '',
          password: isLoggedIn ? 'password123' : '',
        },
        isLoggedIn,
      },
    },
  });

const renderApp = (store) =>
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

describe('App', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    mockAxios.reset();
    jest.restoreAllMocks();
  });

  test('displays the Login component when isLoggedIn is false', () => {
    renderApp(createMockStore(false));

    expect(screen.getByText(/log in to continue/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    expect(screen.queryByText(/course list/i)).not.toBeInTheDocument();
  });

  test('displays the CourseList component when isLoggedIn is true', () => {
    const { container } = renderApp(createMockStore(true));

    expect(screen.getByText(/course list/i)).toBeInTheDocument();
    expect(container.querySelector('#CourseList')).toBeInTheDocument();
    expect(screen.queryByText(/log in to continue/i)).not.toBeInTheDocument();
  });

  test('fetches notifications on mount and displays the notification items', async () => {
    const store = createMockStore(false);
    renderApp(store);

    expect(mockAxios.get).toHaveBeenCalledWith('http://localhost:5173/notifications.json');
    mockAxios.mockResponse({ data: { notifications: notificationsData } });

    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });
    expect(screen.getByText('New course available')).toBeInTheDocument();
    expect(screen.getByText('New resume available')).toBeInTheDocument();
    expect(screen.getByText(/urgent requirement/i)).toBeInTheDocument();
  });

  test('does not fetch courses when the user is logged out', async () => {
    const store = createMockStore(false);
    renderApp(store);

    mockAxios.mockResponse({ data: { notifications: notificationsData } });

    await waitFor(() => {
      expect(store.getState().notifications.notifications).toHaveLength(3);
    });
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.queue()).toHaveLength(0);
  });

  test('fetches courses when logged in and clears them on logout', async () => {
    const user = userEvent.setup();
    const store = createMockStore(true);
    renderApp(store);

    mockAxios.mockResponse({ data: { notifications: notificationsData } });
    expect(mockAxios.get).toHaveBeenCalledWith('http://localhost:5173/courses.json');
    mockAxios.mockResponse({ data: { courses: coursesData } });

    await waitFor(() => {
      expect(screen.getByText('Webpack')).toBeInTheDocument();
    });

    await user.click(screen.getByText('(logout)'));

    await waitFor(() => {
      expect(store.getState().auth.isLoggedIn).toBe(false);
    });
    expect(store.getState().courses.courses).toEqual([]);
    expect(screen.getByText(/log in to continue/i)).toBeInTheDocument();
  });
});
