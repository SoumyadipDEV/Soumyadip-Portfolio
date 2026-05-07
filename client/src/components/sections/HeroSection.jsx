import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FiDownload, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi'

import { getPersonalInfo } from '../../api/personalInfoAPI'
import { getTypewriterRoles } from '../../api/typewriterAPI'
import { downloadLatestResume } from '../../utils/resumeDownload'
import Badge from '../common/Badge'
import Button from '../common/Button'
import EmptyState from '../common/EmptyState'
import SkeletonCard from '../common/SkeletonCard'

const fallbackTagline = 'Software Developer & Technical Support Engineer'
const fallbackRoles = ['Software Developer', 'Technical Support Engineer', 'AX Developer']

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'PF'

const getShortBio = (bio = '') => {
  if (bio.length <= 220) {
    return bio
  }

  return `${bio.slice(0, 217)}...`
}

/** Landing hero populated from public profile data and resume download action. */
function HeroSection() {
  const [personalInfo, setPersonalInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [roles, setRoles] = useState([])
  const [currentText, setCurrentText] = useState('')
  const [downloading, setDownloading] = useState(false)

  // Use refs to avoid stale closures in the interval
  const currentRoleIndexRef = useRef(0)
  const currentTextRef = useRef('')
  const isDeletingRef = useRef(false)

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        const [personalData, rolesData] = await Promise.all([
          getPersonalInfo(),
          getTypewriterRoles(),
        ])

        if (isMounted) {
          setPersonalInfo(personalData)
          setRoles(rolesData && rolesData.length > 0 ? rolesData : fallbackRoles)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError)
          // Fall back to default roles even if API fails
          setRoles(fallbackRoles)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  const tagline = personalInfo?.tagline || fallbackTagline

  // Typewriter animation for cycling through roles
  useEffect(() => {
    if (!roles || roles.length === 0) {
      return
    }

    let intervalId

    const animate = () => {
      const currentRoleIndex = currentRoleIndexRef.current
      const currentRole = roles[currentRoleIndex]?.role_text || ''
      let currentText = currentTextRef.current
      let isDeleting = isDeletingRef.current

      const TYPING_SPEED = 80
      const ERASING_SPEED = 40
      const PAUSE_DURATION = 1500

      if (!isDeleting) {
        // Typing phase
        if (currentText.length < currentRole.length) {
          currentText = currentRole.slice(0, currentText.length + 1)
          currentTextRef.current = currentText
          setCurrentText(currentText)
          intervalId = window.setTimeout(animate, TYPING_SPEED)
        } else {
          // Finished typing, pause before erasing
          isDeletingRef.current = true
          intervalId = window.setTimeout(animate, PAUSE_DURATION)
        }
      } else {
        // Erasing phase
        if (currentText.length > 0) {
          currentText = currentText.slice(0, currentText.length - 1)
          currentTextRef.current = currentText
          setCurrentText(currentText)
          intervalId = window.setTimeout(animate, ERASING_SPEED)
        } else {
          // Finished erasing, move to next role
          currentRoleIndexRef.current = (currentRoleIndex + 1) % roles.length
          isDeletingRef.current = false
          intervalId = window.setTimeout(animate, 300)
        }
      }
    }

    animate()

    return () => {
      if (intervalId) {
        window.clearTimeout(intervalId)
      }
    }
  }, [roles])

  const socialLinks = useMemo(
    () =>
      [
        { href: personalInfo?.github_url, icon: FiGithub, label: 'GitHub' },
        { href: personalInfo?.linkedin_url, icon: FiLinkedin, label: 'LinkedIn' },
        { href: personalInfo?.twitter_url, icon: FiTwitter, label: 'Twitter' },
      ].filter((link) => link.href),
    [personalInfo],
  )

  const handleResumeDownload = async () => {
    setDownloading(true)

    try {
      await downloadLatestResume()
    } catch (downloadError) {
      toast.error(downloadError.message || 'Unable to download resume')
    } finally {
      setDownloading(false)
    }
  }

  const fullName = personalInfo?.full_name || 'Your Name'
  const shortBio =
    getShortBio(personalInfo?.bio) ||
    'Portfolio profile details will appear here once personal information is added.'

  return (
    <section
      className="relative isolate flex min-h-screen overflow-hidden border-b border-gray-200 bg-white dark:border-navy-lighter dark:bg-navy"
      id="hero"
      style={{
        backgroundImage:
          'linear-gradient(rgba(10,22,40,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(10,22,40,0.04) 1px, transparent 1px), radial-gradient(circle at 12% 24%, rgba(201,168,76,0.22) 0 3px, transparent 4px), radial-gradient(circle at 84% 18%, rgba(201,168,76,0.18) 0 3px, transparent 4px), radial-gradient(circle at 74% 78%, rgba(201,168,76,0.16) 0 3px, transparent 4px)',
        backgroundSize: '52px 52px, 52px 52px, auto, auto, auto',
      }}
    >
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 bg-navy/5 dark:bg-white/5 lg:block" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        {loading ? (
          <>
            <SkeletonCard className="min-h-72" />
            <SkeletonCard className="min-h-72 rounded-full" />
          </>
        ) : error ? (
          <div className="lg:col-span-2">
            <EmptyState
              message="Check that the API server is running and Supabase credentials are configured."
              title="Unable to load profile"
            />
          </div>
        ) : !personalInfo ? (
          <div className="lg:col-span-2">
            <EmptyState
              message="Add a personal_info row from the admin panel to populate this section."
              title="Profile details are empty"
            />
          </div>
        ) : (
          <>
            <div>
              <Badge>{tagline}</Badge>
              <p className="mt-8 text-lg font-medium text-gold">Hello, I&apos;m</p>
              <h1 className="mt-3 text-5xl font-bold text-gray-800 sm:text-7xl dark:text-gray-100">
                {fullName}
              </h1>
              <p className="mt-5 min-h-8 text-2xl font-semibold text-gold">
                <span>I am a </span>
                <span>{currentText}</span>
                <span className="cursor">|</span>
              </p>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-500 dark:text-gray-400">
                {shortBio}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button as="a" href="#projects">
                  View My Work
                </Button>
                <Button disabled={downloading} onClick={handleResumeDownload} variant="outline">
                  <FiDownload aria-hidden="true" />
                  {downloading ? 'Preparing Resume' : 'Download Resume'}
                </Button>
              </div>

              {socialLinks.length ? (
                <div className="mt-8 flex gap-3">
                  {socialLinks.map(({ href, icon: Icon, label }) => (
                    <a
                      aria-label={label}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold text-gold transition hover:bg-gold hover:text-navy"
                      href={href}
                      key={label}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <Icon aria-hidden="true" />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              className="flex justify-center lg:justify-end"
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="relative aspect-square w-72 rounded-full border-4 border-gold bg-navy p-2 shadow-2xl shadow-gold/20 sm:w-96">
                <div className="absolute -right-3 top-12 h-5 w-5 rounded-full bg-gold" />
                <div className="absolute bottom-16 left-0 h-3 w-3 rounded-full bg-gold" />
                {personalInfo.profile_image_url ? (
                  <img
                    alt={fullName}
                    className="h-full w-full rounded-full object-cover"
                    src={personalInfo.profile_image_url}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-navy-light text-6xl font-bold text-gold">
                    {getInitials(fullName)}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}

export default HeroSection
