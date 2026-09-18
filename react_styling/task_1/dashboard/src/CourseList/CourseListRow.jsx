function CourseListRow({
  isHeader = false,
  textFirstCell = '',
  textSecondCell = null,
}) {
  const rowClasses = isHeader
    ? 'bg-[var(--color-table-header)] opacity-[66%]'
    : 'bg-[var(--color-table-rows)] opacity-[45%]'
  const headerCellClasses = 'border border-gray-400 text-center font-bold'
  const dataCellClasses = 'border border-gray-400 pl-2 text-left'

  if (isHeader) {
    return (
      <tr className={rowClasses}>
        {textSecondCell === null ? (
          <th className={headerCellClasses} colSpan={2}>{textFirstCell}</th>
        ) : (
          <>
            <th className={headerCellClasses}>{textFirstCell}</th>
            <th className={`${headerCellClasses} w-1/3`}>{textSecondCell}</th>
          </>
        )}
      </tr>
    )
  }

  return (
    <tr className={rowClasses}>
      <td className={dataCellClasses}>{textFirstCell}</td>
      <td className={`${dataCellClasses} w-1/3`}>{textSecondCell}</td>
    </tr>
  )
}

export default CourseListRow
