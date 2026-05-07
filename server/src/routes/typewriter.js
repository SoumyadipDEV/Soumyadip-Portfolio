import { Router } from 'express';
import { body, param } from 'express-validator';

import {
  getTypewriterRoles,
  createTypewriterRole,
  updateTypewriterRole,
  deleteTypewriterRole,
} from '../controllers/typewriterController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();
const idValidator = param('id').isUUID().withMessage('A valid role id is required');

router.get('/', getTypewriterRoles);
router.post(
  '/',
  authMiddleware,
  body('role_text').trim().notEmpty().withMessage('Role text is required'),
  validateRequest,
  createTypewriterRole,
);
router.put(
  '/:id',
  authMiddleware,
  idValidator,
  body('role_text').trim().notEmpty().withMessage('Role text is required'),
  validateRequest,
  updateTypewriterRole,
);
router.delete('/:id', authMiddleware, idValidator, validateRequest, deleteTypewriterRole);

export default router;
