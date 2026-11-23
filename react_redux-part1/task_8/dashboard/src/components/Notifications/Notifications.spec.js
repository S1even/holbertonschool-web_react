import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import Notifications from './Notifications';
import notificationsReducer, {
  fetchNotifications,
} from '../../features/notifications/notificationsSlice';

const notificationsData = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', html: { __html: '' } },
];

const createMockStore = () =>
  configureStore({
    reducer: {
      notifications: notificationsReducer,
    },
  });

const renderWithFetchedNotifications = async () => {
  const store = createMockStore();
  const promise = store.dispatch(fetchNotifications());
  mockAxios.mockResponse({ data: { notifications: notificationsData } });
  await promise;

  render(
    <Provider store={store}>
      <Notifications />
    </Provider>
  );
  return store;
};

describe('Notifications', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    mockAxios.reset();
    jest.restoreAllMocks();
  });

  test('displays the notification items fetched from the API', async () => {
    await renderWithFetchedNotifications();

    expect(mockAxios.get).toHaveBeenCalledWith('http://localhost:5173/notifications.json');
    expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('New course available')).toBeInTheDocument();
    expect(screen.getByText('New resume available')).toBeInTheDocument();
    expect(screen.getByText(/urgent requirement/i)).toBeInTheDocument();
  });

  test('sets displayDrawer to false when the drawer is closed', async () => {
    const store = await renderWithFetchedNotifications();

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(store.getState().notifications.displayDrawer).toBe(false);
    expect(screen.queryByText(/here is the list of notifications/i)).not.toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  test('sets displayDrawer to true when the drawer is opened', async () => {
    const store = await renderWithFetchedNotifications();

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(store.getState().notifications.displayDrawer).toBe(false);

    fireEvent.click(screen.getByText(/your notifications/i));

    expect(store.getState().notifications.displayDrawer).toBe(true);
    expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument();
  });

  test('removes a notification from the list when it is marked as read', async () => {
    const store = await renderWithFetchedNotifications();

    fireEvent.click(screen.getByText('New resume available'));

    expect(store.getState().notifications.notifications.map(({ id }) => id)).toEqual([1, 3]);
    expect(screen.queryByText('New resume available')).not.toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(console.log).toHaveBeenCalledWith('Notification 2 has been marked as read');
  });
});
