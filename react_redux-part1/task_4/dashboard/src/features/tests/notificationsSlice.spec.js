import mockAxios from 'jest-mock-axios';
import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer, {
  fetchNotifications,
  markNotificationAsRead,
  showDrawer,
  hideDrawer,
} from '../notifications/notificationsSlice';
import { getLatestNotification } from '../../utils/utils';

describe('notificationsSlice', () => {
  const initialState = {
    notifications: [],
    displayDrawer: true,
  };

  const notificationsData = [
    { id: 1, type: 'default', value: 'New course available' },
    { id: 2, type: 'urgent', value: 'New resume available' },
    { id: 3, type: 'urgent', html: { __html: '' } },
  ];

  let logSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    mockAxios.reset();
    logSpy.mockRestore();
  });

  test('returns the correct initial state by default', () => {
    expect(notificationsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('fetches notifications data correctly', async () => {
    const store = configureStore({ reducer: { notifications: notificationsReducer } });

    const promise = store.dispatch(fetchNotifications());

    expect(mockAxios.get).toHaveBeenCalledWith('http://localhost:5173/notifications.json');
    mockAxios.mockResponse({ data: { notifications: notificationsData } });
    await promise;

    expect(store.getState().notifications.notifications).toEqual([
      notificationsData[0],
      notificationsData[1],
      { id: 3, type: 'urgent', html: { __html: getLatestNotification() } },
    ]);
  });

  test('updates notifications when fetchNotifications is fulfilled', () => {
    const state = notificationsReducer(initialState, {
      type: fetchNotifications.fulfilled.type,
      payload: notificationsData,
    });

    expect(state.notifications).toEqual(notificationsData);
  });

  test('removes a notification when markNotificationAsRead is dispatched', () => {
    const state = notificationsReducer(
      { ...initialState, notifications: notificationsData },
      markNotificationAsRead(2)
    );

    expect(state.notifications).toEqual([notificationsData[0], notificationsData[2]]);
    expect(logSpy).toHaveBeenCalledWith('Notification 2 has been marked as read');
  });

  test('toggles displayDrawer with showDrawer and hideDrawer', () => {
    const hidden = notificationsReducer(initialState, hideDrawer());
    expect(hidden.displayDrawer).toBe(false);

    const shown = notificationsReducer(hidden, showDrawer());
    expect(shown.displayDrawer).toBe(true);
  });
});
