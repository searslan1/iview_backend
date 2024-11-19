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
exports.AuthService = void 0;
const user_repository_1 = require("../repository/user.repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
class AuthService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    // JWT token üretme
    generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, config_1.config.jwtSecret, { expiresIn: '1h' });
    }
    // Kullanıcı giriş doğrulama
    validateUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByUsername(username);
            if (!user) {
                return false; // Kullanıcı bulunamazsa false döner
            }
            // Parolayı doğrula
            return yield bcrypt_1.default.compare(password, user.password);
        });
    }
    // Kullanıcı giriş işlemi (şifre ve token istemciye döndürülmez)
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByUsername(username);
            if (!user) {
                return { success: false, message: 'Geçersiz kullanıcı adı veya şifre' };
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return { success: false, message: 'Geçersiz kullanıcı adı veya şifre' };
            }
            // Başarı mesajı döner (token veya şifre döndürülmez)
            return { success: true, message: 'Başarıyla giriş yapıldı' };
        });
    }
    // Admin yetkisi verme
    grantAdminRole(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByUsername(username);
            if (!user) {
                throw new Error('Kullanıcı bulunamadı.');
            }
            user.role = 'admin';
            yield this.userRepository.updateUser(user);
        });
    }
}
exports.AuthService = AuthService;
