"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = exports.authorizeUserOrAdmin = exports.authorizeAdminOrMaster = exports.authorizeMaster = exports.authorizeAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
// Kimlik doğrulama middleware
const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Yetkisiz' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        if (typeof decoded === 'string') {
            res.status(403).json({ message: 'Geçersiz token formatı' });
            return;
        }
        req.user = decoded;
        next();
    }
    catch (_b) {
        res.status(403).json({ message: 'Geçersiz token' });
    }
};
exports.authenticate = authenticate;
// Admin yetkisi gerektiren işlemler için middleware
const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ message: 'Yetkisiz işlem: admin rolü gerekli' });
        return;
    }
    next();
};
exports.authorizeAdmin = authorizeAdmin;
// Master yetkisi gerektiren işlemler için middleware
const authorizeMaster = (req, res, next) => {
    if (!req.user || req.user.role !== 'master') {
        res.status(403).json({ message: 'Yetkisiz işlem: master rolü gerekli' });
        return;
    }
    next();
};
exports.authorizeMaster = authorizeMaster;
// Hem admin hem de master rollerine izin veren middleware
const authorizeAdminOrMaster = (req, res, next) => {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'master')) {
        res.status(403).json({ message: 'Yetkisiz işlem: admin veya master rolü gerekli' });
        return;
    }
    next();
};
exports.authorizeAdminOrMaster = authorizeAdminOrMaster;
// Hem user hem de admin rollerine izin veren middleware
const authorizeUserOrAdmin = (req, res, next) => {
    if (!req.user || (req.user.role !== 'user' && req.user.role !== 'admin')) {
        res.status(403).json({ message: 'Yetkisiz işlem: user veya admin rolü gerekli' });
        return;
    }
    next();
};
exports.authorizeUserOrAdmin = authorizeUserOrAdmin;
// Dinamik rol yetkilendirme middleware
const authorizeRole = (role) => (req, res, next) => {
    if (!req.user || req.user.role !== role) {
        res.status(403).json({ message: `Yetkisiz işlem: ${role} rolü gerekli` });
        return;
    }
    next();
};
exports.authorizeRole = authorizeRole;
