import { Router } from 'express';
import { body, param } from 'express-validator';

import {
  createExperience,
  deleteExperience,
  getExperience,
  updateExperience,
} from '../controllers/experienceController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();
const idValidator = param('id').isUUID().withMessage('A valid experience id is required');

router.get('/', getExperience);
router.post(
  '/',
  authMiddleware,
  body('company_name').trim().notEmpty().withMessage('Company name is required'),
  body('job_title').trim().notEmpty().withMessage('Job title is required'),
  validateRequest,
  createExperience,
);
router.put('/:id', authMiddleware, idValidator, validateRequest, updateExperience);
router.delete('/:id', authMiddleware, idValidator, validateRequest, deleteExperience);

export default router;
