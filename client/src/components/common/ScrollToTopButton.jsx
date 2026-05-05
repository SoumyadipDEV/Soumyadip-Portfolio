import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'

/** Floating public-page control that returns the viewport to the top. */
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          aria-label="Scroll to top"
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold text-navy shadow-lg shadow-gold/30 transition hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 dark:focus:ring-offset-navy"
          exit={{ opacity: 0, y: 12 }}
          initial={{ opacity: 0, y: 12 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          type="button"
        >
          <FiArrowUp aria-hidden="true" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}

export default ScrollToTopButton
