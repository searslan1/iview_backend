import express from 'express';
import { uploadVideoController } from '../controller/video.controller';


import multer from 'multer';

const router = express.Router();

// Multer ile video dosyasını geçici olarak yükle
const upload = multer({ dest: 'uploads/' });

// Video yükleme rotası
router.post('/upload-video', upload.single('video'), uploadVideoController);

export default router;