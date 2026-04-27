import { useEffect, useMemo, useState } from 'react'
import { FiExternalLink, FiGithub, FiStar } from 'react-icons/fi'

import { getProjects } from '../../api/projectsAPI'
import Badge from '../common/Badge'
import Button from '../common/Button'
import EmptyState from '../common/EmptyState'
import SkeletonCard from '../common/SkeletonCard'
import SectionShell from './SectionShell'

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Featured', value: 'featured' },
]

const getInitials = (title = '') =>
  title
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'PR'

function ProjectsSection() {
  const [projects, setProjects] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    getProjects()
      .then((data) => {
        if (isMounted) {
          setProjects(data)
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

  const visibleProjects = useMemo(() => {
    if (activeTab === 'featured') {
      return projects.filter((project) => project.is_featured)
    }

    return projects
  }, [activeTab, projects])

  return (
    <SectionShell badge="Projects" id="projects" title="Selected work" tone="alt">
      <div className="mb-8 flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            className={[
              'rounded-full border px-4 py-2 text-sm font-semibold transition',
              activeTab === tab.value
                ? 'border-gold bg-gold text-navy'
                : 'border-gray-300 bg-white text-gray-800 hover:border-gold hover:text-gold dark:border-navy-lighter dark:bg-navy dark:text-gray-100',
            ].join(' ')}
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard className="min-h-80" />
          <SkeletonCard className="min-h-80" />
          <SkeletonCard className="min-h-80" />
        </div>
      ) : error ? (
        <EmptyState
          message="The projects endpoint did not respond."
          title="Unable to load projects"
        />
      ) : !projects.length ? (
        <EmptyState
          message="Projects added from the admin panel will appear here."
          title="No projects yet"
        />
      ) : !visibleProjects.length ? (
        <EmptyState
          message="Mark one or more projects as featured to show them in this tab."
          title="No featured projects"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project) => (
            <article
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_20px_45px_rgba(201,168,76,0.18)] dark:border-navy-lighter dark:bg-navy-light"
              key={project.id}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-navy">
                {project.thumbnail_url ? (
                  <img
                    alt={project.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    src={project.thumbnail_url}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-navy text-4xl font-bold text-gold">
                    {getInitials(project.title)}
                  </div>
                )}

                {project.is_featured ? (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy">
                    <FiStar aria-hidden="true" />
                    Featured
                  </span>
                ) : null}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {project.title}
                  </h3>

                  <div className="flex shrink-0 gap-2">
                    {project.live_url ? (
                      <Button
                        aria-label={`${project.title} live demo`}
                        as="a"
                        className="h-9 w-9 px-0"
                        href={project.live_url}
                        rel="noreferrer"
                        size="sm"
                        target="_blank"
                        variant="ghost"
                      >
                        <FiExternalLink aria-hidden="true" />
                      </Button>
                    ) : null}
                    {project.github_url ? (
                      <Button
                        aria-label={`${project.title} GitHub repository`}
                        as="a"
                        className="h-9 w-9 px-0"
                        href={project.github_url}
                        rel="noreferrer"
                        size="sm"
                        target="_blank"
                        variant="ghost"
                      >
                        <FiGithub aria-hidden="true" />
                      </Button>
                    ) : null}
                  </div>
                </div>

                {project.description ? (
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
                    {project.description}
                  </p>
                ) : null}

                {Array.isArray(project.tech_stack) && project.tech_stack.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tech_stack.filter(Boolean).map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </SectionShell>
  )
}

export default ProjectsSection
