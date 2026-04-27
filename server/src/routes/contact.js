import { Router } from 'express';
import { body, param } from 'express-validator';

import {
  deleteContactMessage,
  getContactMessages,
  markMessageAsRead,
  sendContactMessage,
} from '../controllers/contactController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();
const idValidator = param('id').isUUID().withMessage('A valid message id is required');

router.post(
  '/',
  body('sender_name').trim().notEmpty().withMessage('Sender name is required'),
  body('sender_email').trim().isEmail().withMessage('A valid sender email is required'),
  body('sender_email').normalizeEmail(),
  body('subject').optional({ values: 'falsy' }).trim(),
  body('message').trim().notEmpty().withMessage('Message is required'),
  validateRequest,
  sendContactMessage,
);

router.get('/messages', authMiddleware, getContactMessages);
router.put(
  '/messages/:id/read',
  authMiddleware,
  idValidator,
  validateRequest,
  markMessageAsRead,
);
router.delete(
  '/messages/:id',
  authMiddleware,
  idValidator,
  validateRequest,
  deleteContactMessage,
);

export default router;
