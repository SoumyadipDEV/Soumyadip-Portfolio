import { useMemo, useState } from 'react'
import { FiAward, FiBookOpen, FiBriefcase, FiFileText, FiGrid, FiHeart, FiHome, FiLogOut, FiMenu, FiMessageSquare, FiUser, FiX, FiZap } from 'react-icons/fi'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { useAuth } from '../../hooks/useAuth'
import { usePersonalInfo } from '../../hooks/usePersonalInfo'

const adminLinks = [
  { icon: FiHome, label: 'Dashboard', to: '/admin/dashboard' },
  { icon: FiUser, label: 'Personal Info', to: '/admin/personal-info' },
  { icon: FiBookOpen, label: 'Education', to: '/admin/education' },
  { icon: FiBriefcase, label: 'Experience', to: '/admin/experience' },
  { icon: FiGrid, label: 'Projects', to: '/admin/projects' },
  { icon: FiAward, label: 'Certificates', to: '/admin/certificates' },
  { icon: FiZap, label: 'Skills', to: '/admin/skills' },
  { icon: FiHeart, label: 'Hobbies', to: '/admin/hobbies' },
  { icon: FiFileText, label: 'Resume', to: '/admin/resume' },
  { icon: FiMessageSquare, label: 'Messages', to: '/admin/messages' },
]

const getNavClassName = ({ isActive }) =>
  [
    'flex items-center gap-3 border-l-4 px-4 py-3 text-sm font-semibold transition',
    isActive
      ? 'border-gold bg-white/10 text-gold'
      : 'border-transparent text-gray-300 hover:border-gold/50 hover:bg-white/5 hover:text-gold',
  ].join(' ')

function Sidebar({ developerName, onClose, onLogout }) {
  return (
    <div className="flex h-full flex-col bg-navy text-gray-100">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <a className="text-lg font-bold text-gold" href="/admin/dashboard">
          {developerName}
        </a>
        {onClose ? (
          <button
            aria-label="Close admin navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-300 hover:bg-white/10 hover:text-gold lg:hidden"
            onClick={onClose}
            type="button"
          >
            <FiX aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {adminLinks.map(({ icon: Icon, label, to }) => (
          <NavLink className={getNavClassName} key={to} onClick={onClose} to={to}>
            <Icon aria-hidden="true" className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/10 hover:text-gold"
          onClick={onLogout}
          type="button"
        >
          <FiLogOut aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  )
}

function AdminLayout() {
  const { logout, user } = useAuth()
  const { personalInfo } = usePersonalInfo()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const developerName = personalInfo?.full_name || 'Portfolio Admin'

  const pageTitle = useMemo(() => {
    const activeLink = adminLinks.find((link) => location.pathname === link.to)
    return activeLink?.label || 'Admin Panel'
  }, [location.pathname])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/admin/login', { replace: true })
    } catch (error) {
      toast.error(error.message || 'Logout failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-navy dark:text-gray-100">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
        <Sidebar developerName={developerName} onLogout={handleLogout} />
      </aside>

      {isSidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close admin navigation overlay"
            className="absolute inset-0 h-full w-full bg-navy/60"
            onClick={() => setIsSidebarOpen(false)}
            type="button"
          />
          <aside className="relative h-full w-72 shadow-2xl">
            <Sidebar
              developerName={developerName}
              onClose={() => setIsSidebarOpen(false)}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-navy-lighter dark:bg-navy-light/95">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                aria-label="Open admin navigation"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-800 hover:border-gold hover:text-gold dark:border-navy-lighter dark:text-gray-100 lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
                type="button"
              >
                <FiMenu aria-hidden="true" />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase text-gold">Admin Panel</p>
                <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {pageTitle}
                </h1>
              </div>
            </div>

            <div className="min-w-0 text-right">
              <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                {user?.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Signed in</p>
            </div>
          </div>
        </header>

        <main className="h-[calc(100vh-4rem)] overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
