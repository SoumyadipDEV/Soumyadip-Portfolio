import { Router } from 'express';
import multer from 'multer';

import { getResume, uploadResume } from '../controllers/resumeController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

const createUploadError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter(req, file, callback) {
    const isPdf =
      file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      callback(createUploadError('Only PDF resume uploads are allowed'));
      return;
    }

    callback(null, true);
  },
});

router.get('/', getResume);
router.post('/upload', authMiddleware, upload.single('resume'), uploadResume);

export default router;
