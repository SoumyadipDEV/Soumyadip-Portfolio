function SkeletonCard({ className = '' }) {
  return (
    <div
      className={[
        'animate-pulse rounded-lg border border-gray-200 bg-white p-5 dark:border-navy-lighter dark:bg-navy-light',
        className,
      ].join(' ')}
    >
      <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-navy-lighter" />
      <div className="mt-5 space-y-3">
        <div className="h-3 rounded bg-gray-200 dark:bg-navy-lighter" />
        <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-navy-lighter" />
        <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-navy-lighter" />
      </div>
    </div>
  )
}

export default SkeletonCard
