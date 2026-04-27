import { Router } from 'express';
import { body, param } from 'express-validator';

import {
  createCertificate,
  deleteCertificate,
  getCertificates,
  updateCertificate,
} from '../controllers/certificatesController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();
const idValidator = param('id').isUUID().withMessage('A valid certificate id is required');

router.get('/', getCertificates);
router.post(
  '/',
  authMiddleware,
  body('title').trim().notEmpty().withMessage('Certificate title is required'),
  validateRequest,
  createCertificate,
);
router.put('/:id', authMiddleware, idValidator, validateRequest, updateCertificate);
router.delete('/:id', authMiddleware, idValidator, validateRequest, deleteCertificate);

export default router;
