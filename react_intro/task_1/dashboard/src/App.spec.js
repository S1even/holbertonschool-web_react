import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  test('renders an h1 with the text School dashboard', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: /school dashboard/i })
    ).toBeInTheDocument()
  })

  test('renders the body and footer paragraphs', () => {
    render(<App />)

    expect(
      screen.getByText(/login to access the full dashboard/i)
    ).toBeInTheDocument()
    // The year is whatever year the app renders, so match any four digits.
    expect(
      screen.getByText(/copyright\s+\d{4}\s*-\s*holberton school/i)
    ).toBeInTheDocument()
  })

  test('renders an img element', () => {
    render(<App />)

    expect(screen.getByAltText(/holberton logo/i)).toBeInTheDocument()
  })
})
