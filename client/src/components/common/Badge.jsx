function Badge({ children, className = '' }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border border-gold/40 bg-navy px-3 py-1 text-xs font-medium text-gold dark:border-gold/60 dark:bg-navy-light dark:text-gold-light',
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}

export default Badge
