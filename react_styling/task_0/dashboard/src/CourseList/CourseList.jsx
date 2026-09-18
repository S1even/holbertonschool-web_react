import './CourseList.css'
import CourseListRow from './CourseListRow'
import WithLogging from '../HOC/WithLogging'

function CourseList({ courses = [] }) {
  if (courses.length === 0) {
    return (
      <table id="CourseList">
        <thead>
          <CourseListRow textFirstCell="No course available yet" isHeader />
        </thead>
      </table>
    )
  }

  return (
    <table id="CourseList">
      <thead>
        <CourseListRow textFirstCell="Available courses" isHeader />
        <CourseListRow
          textFirstCell="Course name"
          textSecondCell="Credit"
          isHeader
        />
      </thead>
      <tbody>
        {courses.map(({ id, name, credit }) => (
          <CourseListRow key={id} textFirstCell={name} textSecondCell={credit} />
        ))}
      </tbody>
    </table>
  )
}

// Exported wrapped, so every mount and unmount of the table is logged.
const CourseListWithLogging = WithLogging(CourseList)

export default CourseListWithLogging
