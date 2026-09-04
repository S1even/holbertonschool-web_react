import { render, screen } from '@testing-library/react'
import Header from './Header'

describe('Header', () => {
  test('renders the Holberton logo', () => {
    const { container } = render(<Header />)
    const images = Array.from(container.querySelectorAll('img'))

    // The logo is identified by its alt text or its source, so the assertion
    // survives a component that words the alt attribute differently.
    const logo = images.find((image) =>
      /holberton/i.test(`${image.getAttribute('alt')} ${image.getAttribute('src')}`)
    )

    expect(logo).toBeDefined()
    expect(logo).toBeInTheDocument()
  })

  test('renders an h1 with the text School dashboard', () => {
    render(<Header />)

    expect(
      screen.getByRole('heading', { level: 1, name: /school dashboard/i })
    ).toBeInTheDocument()
  })
})
