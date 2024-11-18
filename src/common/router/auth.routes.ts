// auth.routes.ts

import { Router } from 'express';
import { authController } from '../controller/auth.controller';
import { authenticate, authorizeAdmin, authorizeMaster } from '../middleware/auth.middleware';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';

const router = Router();

// Rate limiting middleware
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Çok fazla giriş denemesi yapıldı. Lütfen daha sonra tekrar deneyin.'
});

// Giriş doğrulama ve sanitize işlemleri
const loginValidation = [
  body('username').isString().isLength({ min: 3, max: 20 }).trim().escape(),
  body('password').isString().isLength({ min: 6, max: 50 }).trim().escape()
];

// Admin rolü verme route'u
router.post('/grant-admin', authenticate, authorizeMaster, authController.grantAdminRole.bind(authController));

// Admin giriş route'u
router.post('/login', loginLimiter, loginValidation, authController.login.bind(authController));

// Refresh token yenileme route'u
router.post('/refresh-token', authController.refreshToken.bind(authController));

// Sadece admin yetkisi gerektiren bir route
router.post('/admin-data', authenticate, authorizeAdmin, (req, res) => {
  res.status(200).json({ message: 'Admin yetkisi ile erişildi.' });
});

// Sadece master yetkisi gerektiren bir route
router.get('/master-data', authenticate, authorizeMaster, (req, res) => {
  res.status(200).json({ message: 'Master yetkisi ile erişildi.' });
});

export default router;
