import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs/promises";

// AWS S3 istemcisi oluştur
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

/**
 * AWS S3'e video yüklemek için bir yardımcı fonksiyon.
 * @param file - Multer dosya nesnesi
 * @param formId - Benzersiz form ID'si
 * @returns Yüklenen dosyanın benzersiz adı
 */
export const uploadVideo = async (file: Express.Multer.File, formId: string): Promise<string> => {
  try {
    // Dosya içeriklerini oku
    const fileContent = await fs.readFile(file.path);

    // Benzersiz dosya adı oluştur
    const uniqueFileName = `${formId}_${Date.now()}_${file.originalname}`;

    // S3 yükleme parametreleri
    const params = {
      Bucket: process.env.BUCKET_NAME!,
      Key: `videos/${uniqueFileName}`,
      Body: fileContent,
      ContentType: file.mimetype,
    };

    // S3'ye dosya yükle
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Geçici dosyayı sil (isteğe bağlı)
    await fs.unlink(file.path);

    // Benzersiz dosya adını döndür
    return uniqueFileName;
  } catch (err) {
    throw new Error("S3'ye yükleme hatası: " + (err as Error).message);
  }
};
