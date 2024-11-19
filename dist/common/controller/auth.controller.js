"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_schema_1 = require("../models/user.schema");
const config_1 = require("../config/config");
class AuthController {
    // Kullanıcıyı doğrulayıp access ve refresh token döndürme
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            try {
                const user = yield user_schema_1.User.findOne({ username });
                if (!user) {
                    res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
                    return;
                }
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
                    return;
                }
                const accessToken = this.generateAccessToken({ userId: user._id.toString(), username: user.username, role: user.role });
                const refreshToken = this.generateRefreshToken({ userId: user._id.toString() });
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 15 * 60 * 1000
                });
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
                res.status(200).json({ success: true, message: 'Başarıyla giriş yapıldı.' });
            }
            catch (error) {
                console.error('Login error:', error);
                res.status(500).json({ message: 'Sunucu hatası' });
            }
        });
    }
    generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, config_1.config.jwtSecret, { expiresIn: '15m' });
    }
    generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, config_1.config.jwtSecret, { expiresIn: '7d' });
    }
    // Refresh token yenileme
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.cookies;
            if (!refreshToken) {
                res.status(401).json({ message: 'Yetkisiz erişim' });
                return;
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.config.jwtSecret);
                const user = yield user_schema_1.User.findById(decoded.userId);
                if (!user) {
                    res.status(401).json({ message: 'Kullanıcı bulunamadı' });
                    return;
                }
                const newAccessToken = this.generateAccessToken({ userId: user._id.toString(), username: user.username, role: user.role });
                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 15 * 60 * 1000
                });
                res.status(200).json({ success: true });
            }
            catch (error) {
                console.error('Token yenileme hatası:', error);
                res.status(403).json({ message: 'Geçersiz token' });
            }
        });
    }
    // Admin rolü verme fonksiyonu
    grantAdminRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username } = req.body;
            try {
                yield user_schema_1.User.updateOne({ username }, { role: 'admin' });
                res.status(200).json({ message: 'Admin yetkisi başarıyla verildi.' });
            }
            catch (error) {
                console.error('Admin yetkisi hatası:', error);
                res.status(500).json({ message: 'Sunucu hatası' });
            }
        });
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
