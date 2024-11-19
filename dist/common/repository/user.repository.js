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
exports.UserRepository = void 0;
const user_schema_1 = require("../models/user.schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserRepository {
    // Veritabanından kullanıcıyı kullanıcı adıyla bul
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_schema_1.User.findOne({ username });
            }
            catch (error) {
                console.error('Error finding user by username:', error);
                throw new Error('Veritabanında kullanıcı aranırken bir hata oluştu.');
            }
        });
    }
    // Kullanıcı bilgilerini güncelle
    updateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield user.save();
            }
            catch (error) {
                console.error('Error updating user:', error);
                throw new Error('Kullanıcı güncellenirken bir hata oluştu.');
            }
        });
    }
    // Yeni kullanıcı ekle
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saltRounds = 10;
                user.password = yield bcrypt_1.default.hash(user.password, saltRounds); // Şifreyi hashle
                const newUser = new user_schema_1.User(user);
                return yield newUser.save();
            }
            catch (error) {
                console.error('Error adding new user:', error);
                throw new Error('Yeni kullanıcı eklenirken bir hata oluştu.');
            }
        });
    }
}
exports.UserRepository = UserRepository;
