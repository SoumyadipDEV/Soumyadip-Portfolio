export { default as api } from './axiosInstance'
export {
  createCertificate,
  deleteCertificate,
  getCertificates,
  updateCertificate,
} from './certificatesAPI'
export { sendContactMessage } from './contactAPI'
export { createEducation, deleteEducation, getEducation, updateEducation } from './educationAPI'
export {
  createExperience,
  deleteExperience,
  getExperience,
  updateExperience,
} from './experienceAPI'
export { createHobby, deleteHobby, getHobbies, updateHobby } from './hobbiesAPI'
export { getContactMessages } from './messagesAPI'
export { getPersonalInfo, updatePersonalInfo } from './personalInfoAPI'
export { getPortfolioStats } from './portfolioStatsAPI'
export {
  createProject,
  deleteProject,
  getFeaturedProjects,
  getProjects,
  updateProject,
} from './projectsAPI'
export { getResume } from './resumeAPI'
export { createSkill, deleteSkill, getSkills, updateSkill } from './skillsAPI'
