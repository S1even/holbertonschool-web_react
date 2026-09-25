import CourseListRow from './CourseListRow'
import WithLogging from '../HOC/WithLogging'

function CourseList({ courses = [] }) {
  const isEmpty = courses.length === 0

  // Une seule structure pour les deux états : la table vide et la table remplie
  // partagent donc exactement le même conteneur et les mêmes classes.
  return (
    <div className="w-4/5 mx-auto my-4">
      <table id="CourseList" className="w-full border-collapse">
        <thead>
          {isEmpty ? (
            <CourseListRow textFirstCell="No course available yet" isHeader />
          ) : (
            <>
              <CourseListRow textFirstCell="Available courses" isHeader />
              <CourseListRow
                textFirstCell="Course name"
                textSecondCell="Credit"
                isHeader
              />
            </>
          )}
        </thead>
        {!isEmpty && (
          <tbody>
            {courses.map(({ id, name, credit }) => (
              <CourseListRow
                key={id}
                textFirstCell={name}
                textSecondCell={credit}
              />
            ))}
          </tbody>
        )}
      </table>
    </div>
  )
}

// Exported wrapped, so every mount and unmount of the table is logged.
const CourseListWithLogging = WithLogging(CourseList)

export default CourseListWithLogging
