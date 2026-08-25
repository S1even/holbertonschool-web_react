import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  test('renders an h1 with the text School dashboard', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: /school dashboard/i })
    ).toBeInTheDocument()
  })

  test('renders the login paragraph', () => {
    render(<App />)

    expect(
      screen.getByText(/login to access the full dashboard/i)
    ).toBeInTheDocument()
  })

  test('renders an img element', () => {
    render(<App />)

    expect(screen.getByAltText(/holberton logo/i)).toBeInTheDocument()
  })

  test('renders 2 input elements', () => {
    const { container } = render(<App />)
    // Only the email and password fields count, not a submit/button input.
    const fields = Array.from(container.querySelectorAll('input')).filter(
      (input) => !['button', 'reset', 'submit'].includes(input.type)
    )

    expect(fields).toHaveLength(2)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  test('renders 2 label elements, for Email and Password', () => {
    const { container } = render(<App />)
    const labels = Array.from(container.querySelectorAll('label'))

    expect(labels).toHaveLength(2)
    // Order-independent, so the assertion survives a reordered form.
    expect(labels.some((label) => /email/i.test(label.textContent))).toBe(true)
    expect(labels.some((label) => /password/i.test(label.textContent))).toBe(
      true
    )
  })

  test('renders a button with the text OK', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: /^ok$/i })).toBeInTheDocument()
  })

  test('renders the Login form when isLoggedIn is false', () => {
    render(<App isLoggedIn={false} />)

    expect(
      screen.getByText(/login to access the full dashboard/i)
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  test('renders the CourseList table when isLoggedIn is true', () => {
    const { container } = render(<App isLoggedIn />)

    expect(container.querySelector('#CourseList')).toBeInTheDocument()
    expect(screen.getByText('Available courses')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })
})
