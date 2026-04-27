import { Router } from 'express';
import { body, param } from 'express-validator';

import {
  createEducation,
  deleteEducation,
  getEducation,
  updateEducation,
} from '../controllers/educationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();
const idValidator = param('id').isUUID().withMessage('A valid education id is required');

router.get('/', getEducation);
router.post(
  '/',
  authMiddleware,
  body('institution').trim().notEmpty().withMessage('Institution is required'),
  body('degree').trim().notEmpty().withMessage('Degree is required'),
  validateRequest,
  createEducation,
);
router.put('/:id', authMiddleware, idValidator, validateRequest, updateEducation);
router.delete('/:id', authMiddleware, idValidator, validateRequest, deleteEducation);

export default router;
