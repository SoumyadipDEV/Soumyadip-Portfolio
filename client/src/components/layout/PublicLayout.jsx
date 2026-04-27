import { Outlet } from 'react-router-dom'

import { usePersonalInfo } from '../../hooks/usePersonalInfo'
import Footer from './Footer'
import Navbar from './Navbar'

function PublicLayout({ children }) {
  const { personalInfo } = usePersonalInfo()
  const content = children ?? <Outlet />

  return (
    <div className="min-h-screen scroll-smooth bg-white text-gray-800 dark:bg-navy dark:text-gray-100">
      <Navbar personalInfo={personalInfo} />
      <main className="pt-16">{content}</main>
      <Footer personalInfo={personalInfo} />
    </div>
  )
}

export default PublicLayout
