import { render, screen } from '@testing-library/react'
import CourseList from './CourseList'

const coursesList = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
  { id: 3, name: 'React', credit: 40 },
]

describe('CourseList', () => {
  test('renders 5 rows when it receives an array of courses', () => {
    const { container } = render(<CourseList courses={coursesList} />)
    const rows = container.querySelectorAll('tr')

    // 2 header rows + 1 row per course.
    expect(rows).toHaveLength(5)
    expect(screen.getByText(/available courses/i)).toBeInTheDocument()
    expect(screen.getByText(/course name/i)).toBeInTheDocument()
    expect(screen.getByText(/^credit$/i)).toBeInTheDocument()
    expect(screen.getByText(/^es6$/i)).toBeInTheDocument()
    expect(screen.getByText(/^webpack$/i)).toBeInTheDocument()
    expect(screen.getByText(/^react$/i)).toBeInTheDocument()
  })

  test('renders 1 row when it receives an empty array', () => {
    const { container } = render(<CourseList courses={[]} />)

    expect(container.querySelectorAll('tr')).toHaveLength(1)
    expect(screen.getByText(/no course available yet/i)).toBeInTheDocument()
  })

  test('renders a table with the id CourseList', () => {
    const { container } = render(<CourseList courses={coursesList} />)

    expect(container.querySelector('table#CourseList')).toBeInTheDocument()
  })

  test('renders the empty state when no prop is passed', () => {
    const { container } = render(<CourseList />)

    expect(container.querySelectorAll('tr')).toHaveLength(1)
    expect(screen.getByText(/no course available yet/i)).toBeInTheDocument()
  })
})
