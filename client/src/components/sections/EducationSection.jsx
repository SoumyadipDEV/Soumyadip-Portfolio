import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { getEducation } from '../../api/educationAPI'
import Card from '../common/Card'
import EmptyState from '../common/EmptyState'
import SkeletonCard from '../common/SkeletonCard'
import SectionShell from './SectionShell'

const formatEducationYears = (startYear, endYear) => {
  if (startYear && endYear) {
    return `${startYear} – ${endYear}`
  }

  if (startYear) {
    return `${startYear} – Present`
  }

  if (endYear) {
    return `${endYear}`
  }

  return 'Dates unavailable'
}

function EducationSection() {
  const [education, setEducation] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    getEducation()
      .then((data) => {
        if (isMounted) {
          setEducation(data)
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError)
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <SectionShell badge="Education" id="education" title="Academic background" tone="alt">
      {loading ? (
        <div className="grid gap-5 md:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <EmptyState
          message="The education endpoint did not respond."
          title="Unable to load education"
        />
      ) : !education.length ? (
        <EmptyState
          message="Education records added from the admin panel will appear here."
          title="No education records"
        />
      ) : (
        <div className="relative">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-gold/40 md:left-1/2" />

          <div className="space-y-8">
            {education.map((entry, index) => {
              const isLeft = index % 2 === 0
              const field = entry.field_of_study ? `, ${entry.field_of_study}` : ''

              return (
                <motion.div
                  className="relative grid gap-4 pl-12 md:grid-cols-[1fr_48px_1fr] md:pl-0"
                  initial={{ opacity: 0, x: isLeft ? -34 : 34 }}
                  key={entry.id}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  viewport={{ once: true, amount: 0.25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                >
                  <span className="absolute left-[9px] top-6 h-4 w-4 rounded-full border-4 border-gold bg-white shadow dark:bg-navy md:left-1/2 md:-translate-x-1/2" />

                  <Card
                    className={[
                      isLeft ? 'md:col-start-1 md:text-right' : 'md:col-start-3',
                      'relative',
                    ].join(' ')}
                  >
                    <p className="text-sm font-semibold text-gold">
                      {formatEducationYears(entry.start_year, entry.end_year)}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
                      {entry.institution}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-100">
                      {entry.degree}
                      {field}
                    </p>
                    {entry.grade ? (
                      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                        Grade: {entry.grade}
                      </p>
                    ) : null}
                    {entry.description ? (
                      <p className="mt-4 text-sm leading-7 text-gray-500 dark:text-gray-400">
                        {entry.description}
                      </p>
                    ) : null}
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </SectionShell>
  )
}

export default EducationSection
