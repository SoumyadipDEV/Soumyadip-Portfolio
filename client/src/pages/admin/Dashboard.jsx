import { useEffect, useState } from 'react'
import { FiFileText, FiFolderPlus, FiInbox } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import { getCertificates } from '../../api/certificatesAPI'
import { getContactMessages } from '../../api/messagesAPI'
import { getProjects } from '../../api/projectsAPI'
import { getSkills } from '../../api/skillsAPI'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import SkeletonCard from '../../components/common/SkeletonCard'
import { useAuth } from '../../hooks/useAuth'

const countSkills = (skillsData) => {
  if (Array.isArray(skillsData)) {
    return skillsData.length
  }

  if (skillsData && typeof skillsData === 'object') {
    return Object.values(skillsData).reduce(
      (total, skills) => total + (Array.isArray(skills) ? skills.length : 0),
      0,
    )
  }

  return 0
}

const formatReceivedAt = (value) => {
  if (!value) {
    return 'Unknown'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    projects: 0,
    certificates: 0,
    skills: 0,
    unreadMessages: 0,
  })
  const [recentMessages, setRecentMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    Promise.all([getProjects(), getCertificates(), getSkills(), getContactMessages()])
      .then(([projects, certificates, skillsData, messages]) => {
        if (!isMounted) return

        const unreadMessages = messages.filter((message) => !message.is_read)

        setStats({
          projects: projects.length,
          certificates: certificates.length,
          skills: countSkills(skillsData),
          unreadMessages: unreadMessages.length,
        })
        setRecentMessages(unreadMessages.slice(0, 5))
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

  const summaryCards = [
    { label: 'Total Projects', value: stats.projects },
    { label: 'Total Certificates', value: stats.certificates },
    { label: 'Total Skills', value: stats.skills },
    { label: 'Unread Messages', value: stats.unreadMessages },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Welcome back, {user?.email}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review portfolio content and unread contact activity.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button as={Link} to="/admin/projects" variant="outline">
            <FiFolderPlus aria-hidden="true" />
            Add Project
          </Button>
          <Button as={Link} to="/admin/resume" variant="outline">
            <FiFileText aria-hidden="true" />
            Upload Resume
          </Button>
          <Button as={Link} to="/admin/messages" variant="outline">
            <FiInbox aria-hidden="true" />
            View Messages
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <EmptyState
          message="Dashboard counts require the API server, Supabase credentials, and a valid admin session."
          title="Unable to load dashboard"
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <div className="rounded-lg bg-navy p-5 shadow-sm" key={card.label}>
                <p className="text-sm font-medium text-gray-300">{card.label}</p>
                <p className="mt-4 text-4xl font-bold text-gold">{card.value}</p>
              </div>
            ))}
          </div>

          <section className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-navy-lighter dark:bg-navy-light">
            <div className="border-b border-gray-200 px-5 py-4 dark:border-navy-lighter">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Recent Unread Messages
              </h3>
            </div>

            {recentMessages.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-navy-lighter">
                  <thead className="bg-gray-50 dark:bg-navy">
                    <tr>
                      <th className="px-5 py-3 text-left font-semibold text-gray-500 dark:text-gray-400">
                        Sender
                      </th>
                      <th className="px-5 py-3 text-left font-semibold text-gray-500 dark:text-gray-400">
                        Subject
                      </th>
                      <th className="px-5 py-3 text-left font-semibold text-gray-500 dark:text-gray-400">
                        Received
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-navy-lighter">
                    {recentMessages.map((message) => (
                      <tr key={message.id}>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-800 dark:text-gray-100">
                            {message.sender_name}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400">
                            {message.sender_email}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-gray-800 dark:text-gray-100">
                          {message.subject || 'No subject'}
                        </td>
                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                          {formatReceivedAt(message.received_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-5">
                <EmptyState
                  message="New unread contact messages will appear here."
                  title="No unread messages"
                />
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default Dashboard
