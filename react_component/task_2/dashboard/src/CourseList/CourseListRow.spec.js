import { render, screen } from '@testing-library/react'
import CourseListRow from './CourseListRow'

// A tr is only valid inside a table section, so every row is rendered in one.
// Without this React logs a validateDOMNesting warning.
const renderInHead = (ui) =>
  render(
    <table>
      <thead>{ui}</thead>
    </table>
  )

const renderInBody = (ui) =>
  render(
    <table>
      <tbody>{ui}</tbody>
    </table>
  )

describe('CourseListRow', () => {
  describe('when isHeader is true', () => {
    test('renders one columnheader with colspan 2 when textSecondCell is null', () => {
      const { container } = renderInHead(
        <CourseListRow isHeader textFirstCell="Available courses" />
      )

      const headers = screen.getAllByRole('columnheader')

      expect(headers).toHaveLength(1)
      expect(headers[0]).toHaveAttribute('colspan', '2')
      expect(headers[0]).toHaveTextContent(/available courses/i)
      expect(container.querySelectorAll('tr')).toHaveLength(1)
      expect(container.querySelectorAll('td')).toHaveLength(0)
    })

    test('renders 2 th cells when textSecondCell is not null', () => {
      const { container } = renderInHead(
        <CourseListRow
          isHeader
          textFirstCell="Course name"
          textSecondCell="Credit"
        />
      )

      const headers = container.querySelectorAll('th')

      expect(headers).toHaveLength(2)
      expect(headers[0]).toHaveTextContent(/course name/i)
      expect(headers[1]).toHaveTextContent(/credit/i)
      expect(headers[0]).not.toHaveAttribute('colspan')
    })
  })

  describe('when isHeader is false', () => {
    test('renders two td elements within a tr element', () => {
      const { container } = renderInBody(
        <CourseListRow textFirstCell="ES6" textSecondCell={60} />
      )

      const row = container.querySelector('tr')
      const cells = row.querySelectorAll('td')

      expect(row).toBeInTheDocument()
      expect(cells).toHaveLength(2)
      expect(row.querySelectorAll('th')).toHaveLength(0)
      expect(cells[0]).toHaveTextContent(/es6/i)
      expect(cells[1]).toHaveTextContent('60')
    })
  })

  test('does not crash when no prop is passed', () => {
    const { container } = renderInBody(<CourseListRow />)

    expect(container.querySelectorAll('td')).toHaveLength(2)
  })
})
