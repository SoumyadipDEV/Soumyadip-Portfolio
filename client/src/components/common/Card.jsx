function Card({ children, className = '', as: Component = 'div' }) {
  return (
    <Component
      className={[
        'rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-navy-lighter dark:bg-navy-light',
        className,
      ].join(' ')}
    >
      {children}
    </Component>
  )
}

export default Card
