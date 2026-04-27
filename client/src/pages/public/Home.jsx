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

function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <EducationSection />
      <ExperienceSection />
      <ProjectsSection />
      <CertificatesSection />
      <SkillsSection />
      <HobbiesSection />
      <ContactSection />
      <ResumeSection />
    </>
  )
}

export default Home
