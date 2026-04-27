import { Router } from 'express';
import { body, param } from 'express-validator';

import {
  createHobby,
  deleteHobby,
  getHobbies,
  updateHobby,
} from '../controllers/hobbiesController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();
const idValidator = param('id').isUUID().withMessage('A valid hobby id is required');

router.get('/', getHobbies);
router.post(
  '/',
  authMiddleware,
  body('name').trim().notEmpty().withMessage('Hobby name is required'),
  validateRequest,
  createHobby,
);
router.put('/:id', authMiddleware, idValidator, validateRequest, updateHobby);
router.delete('/:id', authMiddleware, idValidator, validateRequest, deleteHobby);

export default router;
