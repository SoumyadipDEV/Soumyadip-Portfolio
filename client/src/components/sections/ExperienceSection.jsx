import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiCalendar, FiMapPin } from 'react-icons/fi'

import { getExperience } from '../../api/experienceAPI'
import Badge from '../common/Badge'
import Card from '../common/Card'
import EmptyState from '../common/EmptyState'
import SkeletonCard from '../common/SkeletonCard'
import SectionShell from './SectionShell'

const descriptionLimit = 260

const formatMonthYear = (value) => {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const formatDateRange = (entry) => {
  const start = formatMonthYear(entry.start_date)
  const end = entry.is_current ? 'Present' : formatMonthYear(entry.end_date)

  if (start && end) {
    return `${start} – ${end}`
  }

  if (start) {
    return `${start} – Present`
  }

  return end || 'Dates unavailable'
}

function ExpandableDescription({ text }) {
  const [expanded, setExpanded] = useState(false)

  if (!text) {
    return null
  }

  const isLong = text.length > descriptionLimit
  const visibleText = !isLong || expanded ? text : `${text.slice(0, descriptionLimit)}...`

  return (
    <div className="mt-4">
      <p className="text-sm leading-7 text-gray-500 dark:text-gray-400">{visibleText}</p>
      {isLong ? (
        <button
          className="mt-2 text-sm font-semibold text-gold hover:underline"
          onClick={() => setExpanded((current) => !current)}
          type="button"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      ) : null}
    </div>
  )
}

function ExperienceSection() {
  const [experience, setExperience] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    getExperience()
      .then((data) => {
        if (isMounted) {
          setExperience(data)
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
    <SectionShell badge="Experience" id="experience" title="Professional experience">
      {loading ? (
        <div className="grid gap-5">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <EmptyState
          message="The experience endpoint did not respond."
          title="Unable to load experience"
        />
      ) : !experience.length ? (
        <EmptyState
          message="Experience records added from the admin panel will appear here."
          title="No experience records"
        />
      ) : (
        <div className="relative pl-10">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-gold/40" />

          <div className="space-y-6">
            {experience.map((entry, index) => (
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -28 }}
                key={entry.id}
                transition={{ delay: index * 0.04, duration: 0.4, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.25 }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <span className="absolute -left-[34px] top-6 h-4 w-4 rounded-full border-4 border-gold bg-white shadow dark:bg-navy" />

                <Card>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                          {entry.company_name}
                        </h3>
                        {entry.employment_type ? <Badge>{entry.employment_type}</Badge> : null}
                        {entry.is_current ? (
                          <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy">
                            Current
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-lg font-semibold text-gold">{entry.job_title}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-2">
                      <FiCalendar aria-hidden="true" className="text-gold" />
                      {formatDateRange(entry)}
                    </span>
                    {entry.location ? (
                      <span className="inline-flex items-center gap-2">
                        <FiMapPin aria-hidden="true" className="text-gold" />
                        {entry.location}
                      </span>
                    ) : null}
                  </div>

                  <ExpandableDescription text={entry.description} />

                  {Array.isArray(entry.tech_stack) && entry.tech_stack.length ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {entry.tech_stack.filter(Boolean).map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>
                  ) : null}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </SectionShell>
  )
}

export default ExperienceSection
