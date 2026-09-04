import './CourseList.css'
import CourseListRow from './CourseListRow'

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

export default CourseList
