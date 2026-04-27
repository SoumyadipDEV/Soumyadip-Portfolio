import { Router } from 'express';
import { body, param } from 'express-validator';

import {
  createSkill,
  deleteSkill,
  getSkills,
  updateSkill,
} from '../controllers/skillsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();
const idValidator = param('id').isUUID().withMessage('A valid skill id is required');

router.get('/', getSkills);
router.post(
  '/',
  authMiddleware,
  body('name').trim().notEmpty().withMessage('Skill name is required'),
  body('proficiency')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Proficiency must be between 0 and 100'),
  validateRequest,
  createSkill,
);
router.put(
  '/:id',
  authMiddleware,
  idValidator,
  body('proficiency')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Proficiency must be between 0 and 100'),
  validateRequest,
  updateSkill,
);
router.delete('/:id', authMiddleware, idValidator, validateRequest, deleteSkill);

export default router;
