import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Header from './Header';
import authReducer, { login } from '../../features/auth/authSlice';

const createMockStore = (preloadedState) =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  });

const loggedInState = {
  auth: {
    user: {
      email: 'test@test.com',
      password: 'password123',
    },
    isLoggedIn: true,
  },
};

const renderWithStore = (store) =>
  render(
    <Provider store={store}>
      <Header />
    </Provider>
  );

describe('Header', () => {
  test('renders the logo and the heading', () => {
    renderWithStore(createMockStore());

    expect(screen.getByRole('heading', { name: /school dashboard/i })).toBeInTheDocument();
    expect(screen.getByAltText('holberton logo')).toBeInTheDocument();
  });

  test('does not display the logout section when the user is logged out', () => {
    renderWithStore(createMockStore());

    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
  });

  test('displays the logout link when isLoggedIn is true', () => {
    const { container } = renderWithStore(createMockStore(loggedInState));

    expect(container.querySelector('#logoutSection')).toBeInTheDocument();
    expect(screen.getByText('(logout)')).toBeInTheDocument();
  });

  test('displays a welcome message with the email after the login action is dispatched', () => {
    const store = createMockStore();
    store.dispatch(login({ email: 'user@holbertonschool.com', password: 'strongpass' }));

    const { container } = renderWithStore(store);

    const logoutSection = container.querySelector('#logoutSection');
    expect(logoutSection).toHaveTextContent(/welcome/i);
    expect(screen.getByText('user@holbertonschool.com')).toBeInTheDocument();
  });

  test('sets isLoggedIn to false when the logout link is clicked', () => {
    const store = createMockStore(loggedInState);
    renderWithStore(store);

    fireEvent.click(screen.getByText('(logout)'));

    expect(store.getState().auth.isLoggedIn).toBe(false);
    expect(store.getState().auth.user).toEqual({ email: '', password: '' });
    expect(screen.queryByText('(logout)')).not.toBeInTheDocument();
  });
});
