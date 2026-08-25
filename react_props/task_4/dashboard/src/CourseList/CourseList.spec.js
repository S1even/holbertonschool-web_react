import { render, screen } from '@testing-library/react'
import CourseList from './CourseList'

const courses = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
  { id: 3, name: 'React', credit: 40 },
]

describe('CourseList', () => {
  test('renders 5 rows when courses are provided', () => {
    const { container } = render(<CourseList courses={courses} />)

    expect(container.querySelectorAll('tr')).toHaveLength(5)
    expect(screen.getByText('ES6')).toBeInTheDocument()
    expect(screen.getByText('Webpack')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  test('renders 1 row when courses is empty', () => {
    const { container } = render(<CourseList courses={[]} />)

    expect(container.querySelectorAll('tr')).toHaveLength(1)
    expect(screen.getByText(/no course available yet/i)).toBeInTheDocument()
  })
})
