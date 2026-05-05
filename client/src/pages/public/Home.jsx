import { AnimatePresence, motion } from 'framer-motion'

import AboutSection from '../../components/sections/AboutSection'
import CertificatesSection from '../../components/sections/CertificatesSection'
import ContactSection from '../../components/sections/ContactSection'
import EducationSection from '../../components/sections/EducationSection'
import ExperienceSection from '../../components/sections/ExperienceSection'
import HeroSection from '../../components/sections/HeroSection'
import HobbiesSection from '../../components/sections/HobbiesSection'
import ProjectsSection from '../../components/sections/ProjectsSection'
import ResumeSection from '../../components/sections/ResumeSection'
import SkillsSection from '../../components/sections/SkillsSection'

const sections = [
  { Component: HeroSection, key: 'hero' },
  { Component: AboutSection, key: 'about' },
  { Component: EducationSection, key: 'education' },
  { Component: ExperienceSection, key: 'experience' },
  { Component: ProjectsSection, key: 'projects' },
  { Component: CertificatesSection, key: 'certificates' },
  { Component: SkillsSection, key: 'skills' },
  { Component: HobbiesSection, key: 'hobbies' },
  { Component: ContactSection, key: 'contact' },
  { Component: ResumeSection, key: 'resume' },
]

/** Public one-page portfolio composition with staggered section entrance. */
function Home() {
  return (
    <AnimatePresence mode="wait">
      <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} key="home-content">
        {sections.map(({ Component, key }, index) => (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 18 }}
            key={key}
            transition={{ delay: index * 0.08, duration: 0.35, ease: 'easeOut' }}
          >
            <Component />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

export default Home
