function EmptyState({ message = 'No data available', title = 'Nothing to show yet' }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center dark:border-navy-lighter dark:bg-navy-light">
      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  )
}

export default EmptyState
