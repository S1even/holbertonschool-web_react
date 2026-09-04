function CourseListRow({
  isHeader = false,
  textFirstCell = '',
  textSecondCell = null,
}) {
  if (isHeader) {
    return (
      <tr>
        {textSecondCell === null ? (
          <th colSpan={2}>{textFirstCell}</th>
        ) : (
          <>
            <th>{textFirstCell}</th>
            <th>{textSecondCell}</th>
          </>
        )}
      </tr>
    )
  }

  return (
    <tr>
      <td>{textFirstCell}</td>
      <td>{textSecondCell}</td>
    </tr>
  )
}

export default CourseListRow
