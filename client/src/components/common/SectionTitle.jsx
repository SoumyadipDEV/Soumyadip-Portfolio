function SectionTitle({ eyebrow, title }) {
  return (
    <div className="mb-8 max-w-3xl">
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase text-gold dark:text-gold-light">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold text-gray-800 sm:text-4xl dark:text-gray-100">
        {title}
      </h2>
      <span className="mt-4 block h-1 w-16 rounded-full bg-gold" />
    </div>
  )
}

export default SectionTitle
