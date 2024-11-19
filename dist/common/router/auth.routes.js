"use strict";
// auth.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controller/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
// Rate limiting middleware
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Çok fazla giriş denemesi yapıldı. Lütfen daha sonra tekrar deneyin.'
});
// Giriş doğrulama ve sanitize işlemleri
const loginValidation = [
    (0, express_validator_1.body)('username').isString().isLength({ min: 3, max: 20 }).trim().escape(),
    (0, express_validator_1.body)('password').isString().isLength({ min: 6, max: 50 }).trim().escape()
];
// Admin rolü verme route'u
router.post('/grant-admin', auth_middleware_1.authenticate, auth_middleware_1.authorizeMaster, auth_controller_1.authController.grantAdminRole.bind(auth_controller_1.authController));
// Admin giriş route'u
router.post('/login', loginLimiter, loginValidation, auth_controller_1.authController.login.bind(auth_controller_1.authController));
// Refresh token yenileme route'u
router.post('/refresh-token', auth_controller_1.authController.refreshToken.bind(auth_controller_1.authController));
// Sadece admin yetkisi gerektiren bir route
router.post('/admin-data', auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin, (req, res) => {
    res.status(200).json({ message: 'Admin yetkisi ile erişildi.' });
});
// Sadece master yetkisi gerektiren bir route
router.get('/master-data', auth_middleware_1.authenticate, auth_middleware_1.authorizeMaster, (req, res) => {
    res.status(200).json({ message: 'Master yetkisi ile erişildi.' });
});
exports.default = router;
