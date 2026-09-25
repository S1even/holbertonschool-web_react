import { render, screen } from '@testing-library/react'
import BodySection from './BodySection'

describe('BodySection', () => {
  test('renders a heading holding the title prop', () => {
    const { container } = render(<BodySection title="test" />)

    expect(
      screen.getByRole('heading', { level: 2, name: /test/i })
    ).toBeInTheDocument()
    expect(container.querySelector('.bodySection')).toBeInTheDocument()
  })

  test('renders the single child it is given', () => {
    render(
      <BodySection title="test">
        <p>test</p>
      </BodySection>
    )

    expect(screen.getByText(/^test$/i, { selector: 'p' })).toBeInTheDocument()
  })

  test('renders any number of children', () => {
    const { container } = render(
      <BodySection title="Many children">
        <p>first</p>
        <p>second</p>
        <p>third</p>
      </BodySection>
    )
    const section = container.querySelector('.bodySection')

    expect(section.querySelectorAll('p')).toHaveLength(3)
    // The heading comes first, then the children, in the order they were passed.
    expect(section.firstChild.tagName).toBe('H2')
    expect(section).toHaveTextContent(/first.*second.*third/)
  })

  test('renders without children', () => {
    const { container } = render(<BodySection title="Alone" />)

    expect(container.querySelector('.bodySection')).toBeInTheDocument()
    expect(container.querySelectorAll('p')).toHaveLength(0)
  })
})
