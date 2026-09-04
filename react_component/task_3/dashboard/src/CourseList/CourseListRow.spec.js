import { render, screen } from '@testing-library/react'
import CourseListRow from './CourseListRow'

describe('CourseListRow', () => {
  test('renders one header cell with colspan 2 when textSecondCell is null', () => {
    render(
      <table>
        <thead>
          <CourseListRow isHeader textFirstCell="Available courses" />
        </thead>
      </table>,
    )

    const headers = screen.getAllByRole('columnheader')

    expect(headers).toHaveLength(1)
    expect(headers[0]).toHaveAttribute('colspan', '2')
  })

  test('renders 2 header cells when textSecondCell is provided', () => {
    const { container } = render(
      <table>
        <thead>
          <CourseListRow
            isHeader
            textFirstCell="Course name"
            textSecondCell="Credit"
          />
        </thead>
      </table>,
    )

    expect(container.querySelectorAll('th')).toHaveLength(2)
  })

  test('renders 2 data cells when isHeader is false', () => {
    const { container } = render(
      <table>
        <tbody>
          <CourseListRow textFirstCell="ES6" textSecondCell={60} />
        </tbody>
      </table>,
    )

    expect(container.querySelector('tr')).toBeInTheDocument()
    expect(container.querySelectorAll('td')).toHaveLength(2)
  })
})
