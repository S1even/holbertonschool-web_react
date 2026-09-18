import CourseListRow from './CourseListRow'
import WithLogging from '../HOC/WithLogging'

function CourseList({ courses = [] }) {
  if (courses.length === 0) {
    return (
      <div className="mx-auto w-4/5">
        <table id="CourseList" className="w-full border-collapse border border-gray-400">
          <thead>
            <CourseListRow textFirstCell="No course available yet" isHeader />
          </thead>
        </table>
      </div>
    )
  }

  return (
    <div className="mx-auto w-4/5">
      <table id="CourseList" className="w-full border-collapse border border-gray-400">
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
    </div>
  )
}

// Exported wrapped, so every mount and unmount of the table is logged.
const CourseListWithLogging = WithLogging(CourseList)

export default CourseListWithLogging
