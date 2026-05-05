import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { usePersonalInfo } from '../../hooks/usePersonalInfo'
import { setPortfolioMeta } from '../../utils/documentMeta'
import ScrollToTopButton from '../common/ScrollToTopButton'
import Footer from './Footer'
import Navbar from './Navbar'

/** Shared public shell with SEO bootstrapping and global navigation. */
function PublicLayout({ children }) {
  const { error, loading, personalInfo } = usePersonalInfo()
  const content = children ?? <Outlet />

  useEffect(() => {
    if (loading) {
      return
    }

    setPortfolioMeta(error ? null : personalInfo)
  }, [error, loading, personalInfo])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy">
        <div className="text-center">
          <span className="mx-auto block h-12 w-12 animate-spin rounded-full border-4 border-gold border-t-transparent" />
          <p className="mt-4 text-sm font-semibold text-gold">Loading portfolio</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen scroll-smooth bg-white text-gray-800 dark:bg-navy dark:text-gray-100">
      <Navbar personalInfo={personalInfo} />
      <main className="pt-16">{content}</main>
      <Footer personalInfo={personalInfo} />
      <ScrollToTopButton />
    </div>
  )
}

export default PublicLayout
