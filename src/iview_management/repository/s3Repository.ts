import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs/promises";

// S3 Client oluştur
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
 * @param uniqueFileName - Benzersiz dosya adı
 * @returns Yüklenen dosyanın S3 URL'si
 */
export const uploadVideoToS3 = async (
  file: Express.Multer.File,
  uniqueFileName: string
): Promise<string> => {
  try {
    // Dosya içeriklerini asenkron olarak oku
    const fileContent = await fs.readFile(file.path);

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

    // Yüklenen dosyanın URL'sini döndür
    return `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/videos/${uniqueFileName}`;
  } catch (err) {
    throw new Error("S3'ye yükleme hatası: " + (err as Error).message);
  }
};

/**
 * Presigned URL oluşturmak için bir yardımcı fonksiyon.
 * @param videoKey - S3'deki video anahtarı
 * @returns Presigned URL
 */
export const getPresignedUrlRepository = async (
  videoKey: string
): Promise<string> => {
  try {
    // Presigned URL oluşturma parametreleri
    const params = {
      Bucket: process.env.BUCKET_NAME!,
      Key: `videos/${videoKey}`,
    };

    // Presigned URL oluştur ve döndür
    const command = new GetObjectCommand(params);
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 saat geçerlilik süresi

    return presignedUrl;
  } catch (err) {
    throw new Error("Presigned URL oluşturulamadı: " + (err as Error).message);
  }
};
