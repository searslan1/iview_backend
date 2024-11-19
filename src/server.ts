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

dotenv.config(); // .env dosyasını yükle

// Çevresel değişkenlerin kontrolü
if (!process.env.PORT) {
  console.warn("Warning: PORT environment variable is not defined. Defaulting to 5000.");
}
if (!process.env.DB_URI) {
  console.error("Error: DB_URI is required to connect to the database.");
  process.exit(1); // Uygulama durdurulur
}

// CORS ayarları için tanımlı environment değişkenlerini kontrol ediyoruz
const corsOrigins = [process.env.CORS_ORIGIN, process.env.CORS_USER].filter(
  (origin): origin is string => !!origin
);

// Proxy ayarları (Eğer proxy kullanıyorsanız)
const app = express();
app.set("trust proxy", 1); // Proxy katmanı varsa (örneğin, Heroku, Nginx), doğru yapılandırın

// Veritabanı bağlantısını kuruyoruz
connectDB();

// CORS Middleware
if (corsOrigins.length === 0) {
  console.warn("No CORS origins specified. Defaulting to '*'.");
}
app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : "*", // "*" herkes için izin verir.
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Tarayıcıdan gelen isteklere izin ver
  })
);

// Body parser Middleware
app.use(express.json()); // JSON verilerini parse etmek için
app.use(express.urlencoded({ extended: true })); // URL encoded verileri parse etmek için

// API Router'ları
app.use("/api/register", registerRoutes); // Admin kaydı için
app.use("/api/auth", commonRouter); // Auth işlemleri için
app.use("/api/questions", questionRouter); // Soru yönetimi için
app.use("/api/iview", iviewRoutes); // Mülakat yönetimi için
app.use("/api/candidate", candidateRoutes); // Aday yönetimi için
app.use("/api/videos", videoRoutes); // Video işlemleri için

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "API route not found" });
});

// Hata Yönetimi Middleware'i
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
