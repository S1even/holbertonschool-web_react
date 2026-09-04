import { render, screen } from '@testing-library/react'
import BodySection from './BodySection'

describe('BodySection', () => {
  test('renders a heading with the title prop value', () => {
    render(<BodySection title="Test title" />)

    expect(
      screen.getByRole('heading', { level: 2, name: /test title/i }),
    ).toBeInTheDocument()
  })

  test('renders any number of children passed to it', () => {
    render(
      <BodySection title="Children">
        <p>First child</p>
        <p>Second child</p>
      </BodySection>,
    )

    expect(screen.getByText(/first child/i)).toBeInTheDocument()
    expect(screen.getByText(/second child/i)).toBeInTheDocument()
  })
})
