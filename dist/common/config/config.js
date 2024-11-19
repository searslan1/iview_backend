"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.DB_URI) {
    throw new Error('DB_URI tanımlı değil!');
}
exports.config = {
    masterUsername: process.env.MASTER_USERNAME,
    masterPassword: process.env.MASTER_PASSWORD,
    jwtSecret: process.env.JWT_SECRET || 'default_secret',
    dbUri: process.env.DB_URI
};
