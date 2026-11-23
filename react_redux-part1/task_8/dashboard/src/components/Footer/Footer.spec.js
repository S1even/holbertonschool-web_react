import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Footer from './Footer';
import authReducer from '../../features/auth/authSlice';
import { getCurrentYear, getFooterCopy } from '../../utils/utils';

const createMockStore = (isLoggedIn) =>
  configureStore({
    reducer: {
      auth: authReducer,
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

const renderWithStore = (isLoggedIn) =>
  render(
    <Provider store={createMockStore(isLoggedIn)}>
      <Footer />
    </Provider>
  );

describe('Footer', () => {
  test('displays the "Copyright {current year} - Holberton School" text', () => {
    renderWithStore(false);

    const footerParagraph = screen.getByText(/copyright/i);
    expect(footerParagraph).toHaveTextContent(
      `Copyright ${getCurrentYear()} - ${getFooterCopy(true)}`
    );
    expect(footerParagraph).toHaveTextContent(
      `Copyright ${new Date().getFullYear()} - Holberton School`
    );
  });

  test('displays the "Contact us" link when isLoggedIn is true', () => {
    renderWithStore(true);

    const contactLink = screen.getByRole('link', { name: /contact us/i });
    expect(contactLink).toBeInTheDocument();
  });

  test('does not display the "Contact us" link when isLoggedIn is false', () => {
    renderWithStore(false);

    expect(screen.queryByText(/contact us/i)).not.toBeInTheDocument();
  });
});
