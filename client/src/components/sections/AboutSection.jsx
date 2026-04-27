import { useEffect, useState } from 'react'
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi'

import { getPersonalInfo } from '../../api/personalInfoAPI'
import { getPortfolioStats } from '../../api/portfolioStatsAPI'
import Card from '../common/Card'
import EmptyState from '../common/EmptyState'
import SkeletonCard from '../common/SkeletonCard'
import SectionShell from './SectionShell'

const contactFields = [
  { key: 'location', icon: FiMapPin, label: 'Location' },
  { key: 'email', icon: FiMail, label: 'Email' },
  { key: 'phone', icon: FiPhone, label: 'Phone' },
]

function AboutSection() {
  const [personalInfo, setPersonalInfo] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    Promise.all([getPersonalInfo(), getPortfolioStats()])
      .then(([personalInfoData, statsData]) => {
        if (!isMounted) return

        setPersonalInfo(personalInfoData)
        setStats(statsData)
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

  const facts = [
    {
      label: 'Years Experience',
      value: stats?.yearsOfExperience ? `${stats.yearsOfExperience}+` : '0',
    },
    { label: 'Projects', value: stats?.projectCount ?? 0 },
    { label: 'Certificates', value: stats?.certificateCount ?? 0 },
  ]

  return (
    <SectionShell badge="About" id="about" title="Developer profile">
      {loading ? (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <SkeletonCard className="min-h-64" />
          <SkeletonCard className="min-h-64" />
        </div>
      ) : error ? (
        <EmptyState
          message="The profile or stats endpoints did not respond."
          title="Unable to load about details"
        />
      ) : !personalInfo ? (
        <EmptyState
          message="Add personal information from the admin panel to populate this section."
          title="About details are empty"
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <Card>
            <p className="text-base leading-8 text-gray-500 dark:text-gray-400">
              {personalInfo.bio || 'Bio details have not been added yet.'}
            </p>

            <div className="mt-8 grid gap-4">
              {contactFields.map(({ icon: Icon, key, label }) => {
                const value = personalInfo[key]

                if (!value) {
                  return null
                }

                const href =
                  key === 'email' ? `mailto:${value}` : key === 'phone' ? `tel:${value}` : null

                const content = (
                  <>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                      <Icon aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                        {label}
                      </span>
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {value}
                      </span>
                    </span>
                  </>
                )

                return href ? (
                  <a className="flex items-center gap-3" href={href} key={key}>
                    {content}
                  </a>
                ) : (
                  <div className="flex items-center gap-3" key={key}>
                    {content}
                  </div>
                )
              })}
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Quick Facts
            </h3>
            <div className="mt-6 grid gap-4">
              {facts.map((fact) => (
                <div
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-navy-lighter dark:bg-navy"
                  key={fact.label}
                >
                  <p className="text-3xl font-bold text-gold">{fact.value}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{fact.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </SectionShell>
  )
}

export default AboutSection
