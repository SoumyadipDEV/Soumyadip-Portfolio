import { useEffect, useState } from 'react'
import { FiExternalLink } from 'react-icons/fi'

import { getCertificates } from '../../api/certificatesAPI'
import Button from '../common/Button'
import EmptyState from '../common/EmptyState'
import SkeletonCard from '../common/SkeletonCard'
import SectionShell from './SectionShell'

const getInitials = (value = '') =>
  value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'CT'

const formatMonthYear = (value) => {
  if (!value) {
    return 'Date unavailable'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function CertificatesSection() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    getCertificates()
      .then((data) => {
        if (isMounted) {
          setCertificates(data)
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
    <SectionShell badge="Certificates" id="certificates" title="Credentials">
      {loading ? (
        <div className="grid gap-6 md:grid-cols-3">
          <SkeletonCard className="min-h-80" />
          <SkeletonCard className="min-h-80" />
          <SkeletonCard className="min-h-80" />
        </div>
      ) : error ? (
        <EmptyState
          message="The certificates endpoint did not respond."
          title="Unable to load certificates"
        />
      ) : !certificates.length ? (
        <EmptyState
          message="Certificates added from the admin panel will appear here."
          title="No certificates yet"
        />
      ) : (
        <div className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4">
          {certificates.map((certificate) => (
            <article
              className="group relative min-w-[280px] snap-start overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition duration-300 before:absolute before:inset-y-0 before:-left-1/2 before:w-1/3 before:-translate-x-full before:skew-x-[-18deg] before:bg-gradient-to-r before:from-transparent before:via-gold/20 before:to-transparent before:transition-transform before:duration-700 hover:border-gold hover:shadow-[0_18px_40px_rgba(201,168,76,0.16)] hover:before:translate-x-[460%] dark:border-navy-lighter dark:bg-navy-light sm:min-w-[340px]"
              key={certificate.id}
            >
              <div className="relative aspect-[16/10] bg-navy">
                {certificate.thumbnail_url ? (
                  <img
                    alt={certificate.title}
                    className="h-full w-full object-cover"
                    src={certificate.thumbnail_url}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-gold">
                    {getInitials(certificate.issuing_organization || certificate.title)}
                  </div>
                )}
              </div>

              <div className="relative p-5">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {certificate.title}
                </h3>
                {certificate.issuing_organization ? (
                  <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {certificate.issuing_organization}
                  </p>
                ) : null}

                <dl className="mt-5 grid gap-3 text-sm">
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Issued</dt>
                    <dd className="font-semibold text-gray-800 dark:text-gray-100">
                      {formatMonthYear(certificate.issue_date)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Expiry</dt>
                    <dd className="font-semibold text-gray-800 dark:text-gray-100">
                      {certificate.expiry_date
                        ? formatMonthYear(certificate.expiry_date)
                        : 'No Expiry'}
                    </dd>
                  </div>
                </dl>

                {certificate.credential_url ? (
                  <Button
                    as="a"
                    className="mt-5"
                    href={certificate.credential_url}
                    rel="noreferrer"
                    target="_blank"
                    variant="outline"
                  >
                    <FiExternalLink aria-hidden="true" />
                    View Credential
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </SectionShell>
  )
}

export default CertificatesSection
