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
import Messages from './pages/admin/Messages'
import PersonalInfoPage from './pages/admin/PersonalInfoPage'
import ProjectsPage from './pages/admin/ProjectsPage'
import Resume from './pages/admin/Resume'
import SkillsPage from './pages/admin/SkillsPage'
import Home from './pages/public/Home'

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
          <Route element={<EducationPage />} path="education" />
          <Route element={<ExperiencePage />} path="experience" />
          <Route element={<ProjectsPage />} path="projects" />
          <Route element={<CertificatesPage />} path="certificates" />
          <Route element={<SkillsPage />} path="skills" />
          <Route element={<HobbiesPage />} path="hobbies" />
          <Route element={<Resume />} path="resume" />
          <Route element={<Messages />} path="messages" />
        </Route>

        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </BrowserRouter>
  )
}

export default App
