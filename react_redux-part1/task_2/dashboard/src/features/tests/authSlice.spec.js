import mockAxios from 'jest-mock-axios';
import authReducer, { login, logout } from '../auth/authSlice';

describe('authSlice', () => {
  const initialState = {
    user: {
      email: '',
      password: '',
    },
    isLoggedIn: false,
  };

  afterEach(() => {
    mockAxios.reset();
  });

  test('returns the correct initial state by default', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('updates the state correctly when login is dispatched', () => {
    const credentials = { email: 'user@holbertonschool.com', password: 'strongpass' };
    const state = authReducer(initialState, login(credentials));

    expect(state.user.email).toBe(credentials.email);
    expect(state.user.password).toBe(credentials.password);
    expect(state.isLoggedIn).toBe(true);
  });

  test('resets the state correctly when logout is dispatched', () => {
    const loggedInState = {
      user: {
        email: 'user@holbertonschool.com',
        password: 'strongpass',
      },
      isLoggedIn: true,
    };
    const state = authReducer(loggedInState, logout());

    expect(state.user.email).toBe('');
    expect(state.user.password).toBe('');
    expect(state.isLoggedIn).toBe(false);
    expect(state).toEqual(initialState);
  });

  test('does not mutate the previous state', () => {
    const previous = JSON.parse(JSON.stringify(initialState));
    authReducer(previous, login({ email: 'a@b.c', password: '12345678' }));

    expect(previous).toEqual(initialState);
  });
});
