import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Login from './Login';
import authReducer from '../../features/auth/authSlice';

const createMockStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
  });

const renderWithStore = () => {
  const store = createMockStore();
  render(
    <Provider store={store}>
      <Login />
    </Provider>
  );
  return store;
};

describe('Login', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('displays the login form with email, password fields and submit button', () => {
    renderWithStore();

    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  test('focuses the inputs when their label is clicked', async () => {
    const user = userEvent.setup();
    renderWithStore();

    await user.click(screen.getByText('Email'));
    expect(screen.getByLabelText('Email')).toHaveFocus();

    await user.click(screen.getByText('Password'));
    expect(screen.getByLabelText('Password')).toHaveFocus();
  });

  test('submit button is disabled until both email and password are valid', async () => {
    const user = userEvent.setup();
    renderWithStore();

    const submitButton = screen.getByRole('button', { name: 'OK' });
    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText(/password/i), 'password123');
    expect(submitButton).toBeEnabled();
  });

  test('sets isLoggedIn to true when the form is submitted with valid credentials', async () => {
    const user = userEvent.setup();
    const store = renderWithStore();

    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: 'OK' }));

    expect(store.getState().auth).toEqual({
      user: { email: 'test@test.com', password: 'password123' },
      isLoggedIn: true,
    });
  });

  test('keeps isLoggedIn false when the form is submitted with invalid credentials', () => {
    const store = renderWithStore();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
    fireEvent.submit(screen.getByRole('form'));

    expect(screen.getByRole('button', { name: 'OK' })).toBeDisabled();
    expect(store.getState().auth.isLoggedIn).toBe(false);
    expect(store.getState().auth.user).toEqual({ email: '', password: '' });
  });
});
