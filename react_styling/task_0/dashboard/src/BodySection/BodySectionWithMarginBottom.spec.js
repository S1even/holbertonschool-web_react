import { render, screen } from '@testing-library/react'
import BodySectionWithMarginBottom from './BodySectionWithMarginBottom'

describe('BodySectionWithMarginBottom', () => {
  test('renders a div with the class bodySectionWithMargin', () => {
    const { container } = render(
      <BodySectionWithMarginBottom title="test">
        <p>test</p>
      </BodySectionWithMarginBottom>
    )
    const wrapper = container.querySelector('div.bodySectionWithMargin')

    expect(wrapper).toBeInTheDocument()
  })

  test('renders the BodySection component inside that div', () => {
    const { container } = render(
      <BodySectionWithMarginBottom title="test">
        <p>test</p>
      </BodySectionWithMarginBottom>
    )
    const wrapper = container.querySelector('.bodySectionWithMargin')

    expect(wrapper.querySelector('.bodySection')).toBeInTheDocument()
  })

  test('hands the title and the children down to it', () => {
    const { container } = render(
      <BodySectionWithMarginBottom title="test">
        <p>test</p>
      </BodySectionWithMarginBottom>
    )
    const section = container.querySelector('.bodySection')

    expect(
      screen.getByRole('heading', { level: 2, name: /test/i })
    ).toBeInTheDocument()
    expect(section.querySelectorAll('p')).toHaveLength(1)
    expect(section).toHaveTextContent(/test/i)
  })
})
