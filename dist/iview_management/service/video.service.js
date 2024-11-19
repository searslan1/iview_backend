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
exports.uploadVideo = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const promises_1 = __importDefault(require("fs/promises"));
// AWS S3 istemcisi oluştur
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});
/**
 * AWS S3'e video yüklemek için bir yardımcı fonksiyon.
 * @param file - Multer dosya nesnesi
 * @param formId - Benzersiz form ID'si
 * @returns Yüklenen dosyanın benzersiz adı
 */
const uploadVideo = (file, formId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Dosya içeriklerini oku
        const fileContent = yield promises_1.default.readFile(file.path);
        // Benzersiz dosya adı oluştur
        const uniqueFileName = `${formId}_${Date.now()}_${file.originalname}`;
        // S3 yükleme parametreleri
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `videos/${uniqueFileName}`,
            Body: fileContent,
            ContentType: file.mimetype,
        };
        // S3'ye dosya yükle
        const command = new client_s3_1.PutObjectCommand(params);
        yield s3Client.send(command);
        // Geçici dosyayı sil (isteğe bağlı)
        yield promises_1.default.unlink(file.path);
        // Benzersiz dosya adını döndür
        return uniqueFileName;
    }
    catch (err) {
        throw new Error("S3'ye yükleme hatası: " + err.message);
    }
});
exports.uploadVideo = uploadVideo;
