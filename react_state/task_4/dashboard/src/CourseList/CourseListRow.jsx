// Les cellules partagent la même bordure ; seul un td porte le retrait à gauche.
const cellClass = 'border border-gray-400'
const dataCellClass = `${cellClass} pl-2`

function CourseListRow({
  isHeader = false,
  textFirstCell = '',
  textSecondCell = null,
}) {
  // La teinte et l'opacité de la ligne dépendent de sa nature.
  const rowClass = isHeader
    ? 'bg-table-header opacity-66'
    : 'bg-table-rows opacity-45'

  if (isHeader) {
    return (
      <tr className={rowClass}>
        {textSecondCell === null ? (
          <th colSpan={2} className={cellClass}>
            {textFirstCell}
          </th>
        ) : (
          <>
            <th className={cellClass}>{textFirstCell}</th>
            <th className={cellClass}>{textSecondCell}</th>
          </>
        )}
      </tr>
    )
  }

  return (
    <tr className={rowClass}>
      <td className={dataCellClass}>{textFirstCell}</td>
      <td className={dataCellClass}>{textSecondCell}</td>
    </tr>
  )
}

export default CourseListRow
