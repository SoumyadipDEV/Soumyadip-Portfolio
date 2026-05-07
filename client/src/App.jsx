import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import ProtectedRoute from './components/common/ProtectedRoute'
import AdminLayout from './components/layout/AdminLayout'
import PublicLayout from './components/layout/PublicLayout'
import CertificatesPage from './pages/admin/CertificatesPage'
import Dashboard from './pages/admin/Dashboard'
import EducationPage from './pages/admin/EducationPage'
import ExperiencePage from './pages/admin/ExperiencePage'
import HobbiesPage from './pages/admin/HobbiesPage'
import Login from './pages/admin/Login'
import MessagesPage from './pages/admin/MessagesPage'
import NotFound from './pages/NotFound'
import PersonalInfoPage from './pages/admin/PersonalInfoPage'
import ProjectsPage from './pages/admin/ProjectsPage'
import ResumePage from './pages/admin/ResumePage'
import SkillsPage from './pages/admin/SkillsPage'
import TypewriterRolesPage from './pages/admin/TypewriterRolesPage'
import Home from './pages/public/Home'

/** Main application route map for public and admin areas. */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />} path="/">
          <Route index element={<Home />} />
        </Route>

        <Route element={<Login />} path="/admin/login" />
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
          path="/admin"
        >
          <Route index element={<Navigate replace to="/admin/dashboard" />} />
          <Route element={<Dashboard />} path="dashboard" />
          <Route element={<PersonalInfoPage />} path="personal-info" />
          <Route element={<TypewriterRolesPage />} path="typewriter-roles" />
          <Route element={<EducationPage />} path="education" />
          <Route element={<ExperiencePage />} path="experience" />
          <Route element={<ProjectsPage />} path="projects" />
          <Route element={<CertificatesPage />} path="certificates" />
          <Route element={<SkillsPage />} path="skills" />
          <Route element={<HobbiesPage />} path="hobbies" />
          <Route element={<ResumePage />} path="resume" />
          <Route element={<MessagesPage />} path="messages" />
        </Route>

        <Route element={<NotFound />} path="*" />
      </Routes>
    </BrowserRouter>
  )
}

export default App
