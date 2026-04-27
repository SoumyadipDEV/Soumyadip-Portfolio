import { useEffect, useState } from 'react'

import { getHobbies } from '../../api/hobbiesAPI'
import EmptyState from '../common/EmptyState'
import SkeletonCard from '../common/SkeletonCard'
import SectionShell from './SectionShell'

function HobbiesSection() {
  const [hobbies, setHobbies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    getHobbies()
      .then((data) => {
        if (isMounted) {
          setHobbies(data)
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
    <SectionShell badge="Hobbies" id="hobbies" title="Outside work">
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <EmptyState
          message="The hobbies endpoint did not respond."
          title="Unable to load hobbies"
        />
      ) : !hobbies.length ? (
        <EmptyState
          message="Hobbies added from the admin panel will appear here."
          title="No hobbies yet"
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hobbies.map((hobby, index) => (
            <article
              className={[
                'rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:border-gold hover:shadow-[0_18px_40px_rgba(201,168,76,0.15)] dark:border-navy-lighter dark:bg-navy-light',
                index % 2 === 0 ? 'hover:-rotate-1' : 'hover:rotate-1',
              ].join(' ')}
              key={hobby.id}
            >
              <div className="text-5xl">{hobby.icon || '✦'}</div>
              <h3 className="mt-5 text-xl font-bold text-gray-800 dark:text-gray-100">
                {hobby.name}
              </h3>
              {hobby.description ? (
                <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
                  {hobby.description}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </SectionShell>
  )
}

export default HobbiesSection
