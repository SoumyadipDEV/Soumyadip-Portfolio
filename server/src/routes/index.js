import { Router } from 'express';

import certificatesRoutes from './certificates.js';
import contactRoutes from './contact.js';
import educationRoutes from './education.js';
import experienceRoutes from './experience.js';
import hobbiesRoutes from './hobbies.js';
import personalInfoRoutes from './personalInfo.js';
import projectsRoutes from './projects.js';
import resumeRoutes from './resume.js';
import skillsRoutes from './skills.js';

const router = Router();

router.use('/personal-info', personalInfoRoutes);
router.use('/education', educationRoutes);
router.use('/experience', experienceRoutes);
router.use('/projects', projectsRoutes);
router.use('/certificates', certificatesRoutes);
router.use('/skills', skillsRoutes);
router.use('/hobbies', hobbiesRoutes);
router.use('/contact', contactRoutes);
router.use('/resume', resumeRoutes);

export default router;
