import { Router } from 'express';
import { body } from 'express-validator';

import {
  getPersonalInfo,
  updatePersonalInfo,
} from '../controllers/personalInfoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();

router.get('/', getPersonalInfo);
router.put(
  '/',
  authMiddleware,
  body('full_name').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
  validateRequest,
  updatePersonalInfo,
);

export default router;
