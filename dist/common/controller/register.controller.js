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
exports.RegisterController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_schema_1 = require("../models/user.schema"); // Modelinizin doğru yolunu buraya yazın
class RegisterController {
    // Yeni kullanıcı kaydetmek için bir metod
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                // Kullanıcı adı mevcut mu kontrol et
                const existingUser = yield user_schema_1.User.findOne({ username });
                if (existingUser) {
                    res.status(400).json({ message: 'Username already exists.' });
                    return;
                }
                // Parolayı hashle
                const saltRounds = 10;
                const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
                // Yeni kullanıcı oluştur ve kaydet
                const newUser = new user_schema_1.User({
                    username,
                    password: hashedPassword,
                    role: 'admin'
                });
                yield newUser.save();
                // Başarılı yanıt gönder
                res.status(201).json({ message: 'User registered successfully.' });
            }
            catch (error) {
                console.error('Error during user registration:', error);
                const errorMessage = error.message;
                res.status(500).json({ message: 'Server error during registration.', error: errorMessage });
            }
        });
    }
}
exports.RegisterController = RegisterController;
