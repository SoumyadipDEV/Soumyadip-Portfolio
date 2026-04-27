import { useEffect, useMemo, useRef, useState } from 'react'

import { getSkills } from '../../api/skillsAPI'
import EmptyState from '../common/EmptyState'
import SkeletonCard from '../common/SkeletonCard'
import SectionShell from './SectionShell'

const allTab = 'All'

const normalizeSkillGroups = (data) => {
  if (Array.isArray(data)) {
    return data.reduce((groups, skill) => {
      const category = skill.category || 'Other'
      groups[category] = groups[category] || []
      groups[category].push(skill)
      return groups
    }, {})
  }

  if (data && typeof data === 'object') {
    return Object.entries(data).reduce((groups, [category, skills]) => {
      groups[category] = Array.isArray(skills) ? skills : []
      return groups
    }, {})
  }

  return {}
}

const clampPercentage = (value) => {
  const number = Number(value) || 0
  return Math.min(Math.max(number, 0), 100)
}

function SkillsSection() {
  const sectionRef = useRef(null)
  const [skillGroups, setSkillGroups] = useState({})
  const [activeCategory, setActiveCategory] = useState(allTab)
  const [barsVisible, setBarsVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    getSkills()
      .then((data) => {
        if (isMounted) {
          setSkillGroups(normalizeSkillGroups(data))
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

  useEffect(() => {
    const target = sectionRef.current

    if (!target) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBarsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [])

  const categories = useMemo(() => Object.keys(skillGroups), [skillGroups])
  const totalSkills = useMemo(
    () => categories.reduce((total, category) => total + skillGroups[category].length, 0),
    [categories, skillGroups],
  )

  const visibleGroups = useMemo(() => {
    if (activeCategory === allTab) {
      return categories.map((category) => ({
        category,
        skills: skillGroups[category],
      }))
    }

    return [
      {
        category: activeCategory,
        skills: skillGroups[activeCategory] || [],
      },
    ]
  }, [activeCategory, categories, skillGroups])

  return (
    <SectionShell badge="Skills" id="skills" title="Technical and support skills" tone="alt">
      <div ref={sectionRef}>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : error ? (
          <EmptyState message="The skills endpoint did not respond." title="Unable to load skills" />
        ) : !totalSkills ? (
          <EmptyState
            message="Skills added from the admin panel will appear here."
            title="No skills yet"
          />
        ) : (
          <>
            <div className="mb-8 flex flex-wrap gap-3">
              {[allTab, ...categories].map((category) => (
                <button
                  className={[
                    'rounded-full border px-4 py-2 text-sm font-semibold transition',
                    activeCategory === category
                      ? 'border-gold bg-gold text-navy'
                      : 'border-gray-300 bg-white text-gray-800 hover:border-gold hover:text-gold dark:border-navy-lighter dark:bg-navy dark:text-gray-100',
                  ].join(' ')}
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  type="button"
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {visibleGroups.map(({ category, skills }) => (
                <div
                  className="rounded-lg border border-gray-200 bg-white p-5 dark:border-navy-lighter dark:bg-navy-light"
                  key={category}
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {category}
                  </h3>
                  <div className="mt-5 grid gap-5">
                    {skills.map((skill) => {
                      const percentage = clampPercentage(skill.proficiency)

                      return (
                        <div key={skill.id}>
                          <div className="mb-2 flex items-center justify-between gap-4">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                              {skill.name}
                            </span>
                            <span className="text-sm font-semibold text-gold">{percentage}%</span>
                          </div>
                          <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-navy">
                            <span
                              className="block h-full rounded-full bg-gold transition-all duration-1000 ease-out"
                              style={{ width: barsVisible ? `${percentage}%` : '0%' }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </SectionShell>
  )
}

export default SkillsSection
