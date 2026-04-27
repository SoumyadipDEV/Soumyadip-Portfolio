const variants = {
  primary: 'border-gold bg-gold text-navy hover:bg-gold-light',
  outline:
    'border-gold bg-transparent text-gold hover:bg-gold hover:text-navy dark:border-gold dark:text-gold dark:hover:bg-gold dark:hover:text-navy',
  secondary:
    'border-gold bg-transparent text-gold hover:bg-gold hover:text-navy dark:border-gold dark:text-gold dark:hover:bg-gold dark:hover:text-navy',
  ghost:
    'border-transparent bg-transparent text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-navy-light',
}

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
}

function Button({
  as: Component = 'button',
  children,
  className = '',
  disabled = false,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}) {
  const componentProps = Component === 'button' ? { disabled, type } : {}

  return (
    <Component
      className={[
        'inline-flex items-center justify-center gap-2 rounded-md border font-medium transition focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-navy',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      aria-disabled={Component === 'button' ? undefined : disabled}
      {...componentProps}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Button
