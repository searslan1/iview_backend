import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

// Çevre değişkenlerini yükle
dotenv.config();

// AWS S3 istemcisi oluştur
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export default s3Client;
