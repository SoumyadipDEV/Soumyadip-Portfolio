import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiDownload, FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi'

import { useTheme } from '../../hooks/useTheme'
import { publicNavLinks } from '../../utils/navigationLinks'
import Button from '../common/Button'

function Navbar({ personalInfo }) {
  const { isDark, toggleTheme } = useTheme()
  const [activeSection, setActiveSection] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const sections = publicNavLinks
      .map((link) => document.getElementById(link.id))
      .filter(Boolean)

    if (!sections.length) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id)
        }
      },
      {
        rootMargin: '-35% 0px -50% 0px',
        threshold: [0.15, 0.3, 0.6],
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      observer.disconnect()
    }
  }, [])

  const developerName = personalInfo?.full_name || 'Portfolio'
  const resumeUrl = personalInfo?.resume_url || '#'

  const getLinkClassName = (id) =>
    [
      'text-sm font-medium transition hover:text-gold',
      activeSection === id ? 'text-gold' : 'text-gray-800 dark:text-gray-100',
    ].join(' ')

  const renderNavLinks = (onClick) =>
    publicNavLinks.map((link) => (
      <a
        className={getLinkClassName(link.id)}
        href={`#${link.id}`}
        key={link.id}
        onClick={onClick}
      >
        {link.label}
      </a>
    ))

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 border-b border-gray-200 backdrop-blur transition dark:border-navy-lighter',
        isScrolled
          ? 'bg-white/95 shadow-sm dark:bg-navy/95'
          : 'bg-white/80 dark:bg-navy/80',
      ].join(' ')}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a className="text-base font-semibold text-gold" href="/">
          {developerName}
        </a>

        <div className="hidden items-center gap-5 lg:flex">
          {renderNavLinks()}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            aria-label="Toggle color theme"
            className="h-10 w-10 px-0"
            onClick={toggleTheme}
            variant="ghost"
          >
            {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
          </Button>
          <Button
            as="a"
            href={resumeUrl}
            rel="noreferrer"
            target={resumeUrl === '#' ? undefined : '_blank'}
            variant="outline"
          >
            <FiDownload aria-hidden="true" />
            Download Resume
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button
            aria-label="Toggle color theme"
            className="h-10 w-10 px-0"
            onClick={toggleTheme}
            variant="ghost"
          >
            {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
          </Button>
          <Button
            aria-label="Open navigation menu"
            className="h-10 w-10 px-0"
            onClick={() => setIsDrawerOpen(true)}
            variant="outline"
          >
            <FiMenu aria-hidden="true" />
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {isDrawerOpen ? (
          <>
            <motion.button
              aria-label="Close navigation menu"
              className="fixed inset-0 z-40 h-screen w-screen bg-navy/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              type="button"
            />
            <motion.aside
              animate={{ x: 0 }}
              className="fixed right-0 top-0 z-50 flex h-screen w-80 max-w-[85vw] flex-col gap-6 border-l border-gray-200 bg-white p-5 shadow-xl dark:border-navy-lighter dark:bg-navy"
              exit={{ x: '100%' }}
              initial={{ x: '100%' }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gold">{developerName}</span>
                <Button
                  aria-label="Close navigation menu"
                  className="h-10 w-10 px-0"
                  onClick={() => setIsDrawerOpen(false)}
                  variant="ghost"
                >
                  <FiX aria-hidden="true" />
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                {renderNavLinks(() => setIsDrawerOpen(false))}
              </div>

              <Button
                as="a"
                className="mt-auto"
                href={resumeUrl}
                onClick={() => setIsDrawerOpen(false)}
                rel="noreferrer"
                target={resumeUrl === '#' ? undefined : '_blank'}
                variant="outline"
              >
                <FiDownload aria-hidden="true" />
                Download Resume
              </Button>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
