"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const video_controller_1 = require("../controller/video.controller");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
// Multer ile video dosyasını geçici olarak yükle
const upload = (0, multer_1.default)({ dest: 'uploads/' });
// Video yükleme rotası
router.post('/upload-video', upload.single('video'), video_controller_1.uploadVideoController);
exports.default = router;
