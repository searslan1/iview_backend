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
if (!process.env.PORT) {
  console.warn("Warning: PORT environment variable is not defined.");
}
if (!process.env.DB_URI) {
  console.error("Error: MONGO_URI is required to connect to the database.");
  process.exit(1); // Uygulama durdurulur
}

// CORS ayarları için tanımlı environment değişkenlerini kontrol ediyoruz
const corsOrigins = [process.env.CORS_ORIGIN, process.env.CORS_USER].filter(
  (origin): origin is string => !!origin
);

const app = express();

// Proxy ayarlarını yapıyoruz (X-Forwarded-For başlığını düzgün şekilde almak için)
app.set('trust proxy', 1);  // Eğer proxy katmanı varsa, burada uygun değeri seçebilirsiniz

connectDB();

if (corsOrigins.length === 0) {
  console.warn("No CORS origins specified, defaulting to '*'");
}

// CORS, body parser ve diğer middleware'ler
app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : "*", // "*": herkese izin verir.
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// JSON body parser middleware'ini ekliyoruz
app.use(express.json());  // JSON verilerini parse etmek için
app.use(express.urlencoded({ extended: true })); // URL encoded verileri parse etmek için

// Router ayarları
app.use("/api/register", registerRoutes); // admin kaydı için
app.use("/api/auth", commonRouter); // Auth işlemleri için
app.use("/api/questions", questionRouter); // Soru yönetimi için
app.use("/api/iview", iviewRoutes);
app.use("/api/candidate", candidateRoutes);
app.use('/api/videos', videoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
