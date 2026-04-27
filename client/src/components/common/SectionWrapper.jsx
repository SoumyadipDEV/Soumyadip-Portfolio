import { motion } from 'framer-motion'

const tones = {
  default: 'bg-white dark:bg-navy',
  alt: 'bg-gray-50 dark:bg-navy-light',
}

function SectionWrapper({ children, className = '', id, tone = 'default' }) {
  return (
    <motion.section
      className={['scroll-mt-24 py-16 sm:py-20', tones[tone], className].join(' ')}
      id={id}
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.section>
  )
}

export default SectionWrapper
