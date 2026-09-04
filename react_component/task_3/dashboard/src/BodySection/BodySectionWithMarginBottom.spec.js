import { render, screen } from '@testing-library/react'
import BodySectionWithMarginBottom from './BodySectionWithMarginBottom'

describe('BodySectionWithMarginBottom', () => {
  test('contains a div with the bodySectionWithMargin class', () => {
    const { container } = render(
      <BodySectionWithMarginBottom title="Test title" />,
    )

    expect(container.querySelector('.bodySectionWithMargin')).toBeInTheDocument()
  })

  test('renders the BodySection component', () => {
    render(
      <BodySectionWithMarginBottom title="Test title">
        <p>Test child</p>
      </BodySectionWithMarginBottom>,
    )

    expect(
      screen.getByRole('heading', { level: 2, name: /test title/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/test child/i)).toBeInTheDocument()
  })
})
