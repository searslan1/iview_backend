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
exports.getPresignedUrlRepository = exports.uploadVideoToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const promises_1 = __importDefault(require("fs/promises"));
// S3 Client oluştur
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
 * @param uniqueFileName - Benzersiz dosya adı
 * @returns Yüklenen dosyanın S3 URL'si
 */
const uploadVideoToS3 = (file, uniqueFileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Dosya içeriklerini asenkron olarak oku
        const fileContent = yield promises_1.default.readFile(file.path);
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
        // Yüklenen dosyanın URL'sini döndür
        return `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/videos/${uniqueFileName}`;
    }
    catch (err) {
        throw new Error("S3'ye yükleme hatası: " + err.message);
    }
});
exports.uploadVideoToS3 = uploadVideoToS3;
/**
 * Presigned URL oluşturmak için bir yardımcı fonksiyon.
 * @param videoKey - S3'deki video anahtarı
 * @returns Presigned URL
 */
const getPresignedUrlRepository = (videoKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Presigned URL oluşturma parametreleri
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `videos/${videoKey}`,
        };
        // Presigned URL oluştur ve döndür
        const command = new client_s3_1.GetObjectCommand(params);
        const presignedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 3600 }); // 1 saat geçerlilik süresi
        return presignedUrl;
    }
    catch (err) {
        throw new Error("Presigned URL oluşturulamadı: " + err.message);
    }
});
exports.getPresignedUrlRepository = getPresignedUrlRepository;
