import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/db";
import commonRouter from "./common/router/auth.routes";
import questionRouter from "./question_management/routes/question.routes";
import registerRoutes from "./common/router/register.routes";
import iviewRoutes from "./iview_management/routes/iview.routes";
import candidateRoutes from "./iview_management/routes/candidate.routes";
import videoRoutes from "./iview_management/routes/video.routes";

// .env dosyasını yükle
dotenv.config(); 

// Gerekli çevresel değişkenleri kontrol ediyoruz
if (!process.env.PORT) {
  console.warn("Warning: PORT environment variable is not defined.");
}
if (!process.env.DB_URI) {
  console.error("Error: DB_URI is required to connect to the database.");
  process.exit(1); // Uygulama durdurulur
}

// CORS için origin'leri belirliyoruz
const corsOrigins = [
  process.env.CORS_ORIGIN || "http://localhost:5173",
  process.env.CORS_USER || "http://localhost:5174"
].filter((origin): origin is string => !!origin);

const app = express();

// Proxy ayarları (X-Forwarded-For başlığını düzgün şekilde almak için)
app.set('trust proxy', 1); 

// Veritabanı bağlantısını başlat
connectDB();

// CORS yapılandırması
if (corsOrigins.length === 0) {
  console.warn("No CORS origins specified, defaulting to '*'");
}

app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : "*", // "*" herkese izin verir.
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Çerezleri etkinleştir
  })
);

// Body parser middleware'leri
app.use(express.json()); // JSON verilerini parse etmek için
app.use(express.urlencoded({ extended: true })); // URL encoded verileri parse etmek için

// API rotalarını ekliyoruz
app.use("/api/register", registerRoutes); // Admin kaydı için
app.use("/api/auth", commonRouter); // Auth işlemleri için
app.use("/api/questions", questionRouter); // Soru yönetimi için
app.use("/api/iview", iviewRoutes); // Görüşme yönetimi için
app.use("/api/candidate", candidateRoutes); // Aday yönetimi için
app.use('/api/videos', videoRoutes); // Video işlemleri için

// Sunucu başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
