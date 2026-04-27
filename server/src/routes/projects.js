import { Router } from 'express';
import { body, param } from 'express-validator';

import {
  createProject,
  deleteProject,
  getFeaturedProjects,
  getProjects,
  updateProject,
} from '../controllers/projectsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();
const idValidator = param('id').isUUID().withMessage('A valid project id is required');

router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.post(
  '/',
  authMiddleware,
  body('title').trim().notEmpty().withMessage('Project title is required'),
  validateRequest,
  createProject,
);
router.put('/:id', authMiddleware, idValidator, validateRequest, updateProject);
router.delete('/:id', authMiddleware, idValidator, validateRequest, deleteProject);

export default router;
