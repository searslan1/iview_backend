"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db/db");
const auth_routes_1 = __importDefault(require("./common/router/auth.routes"));
const question_routes_1 = __importDefault(require("./question_management/routes/question.routes"));
const register_routes_1 = __importDefault(require("./common/router/register.routes"));
const iview_routes_1 = __importDefault(require("./iview_management/routes/iview.routes"));
const candidate_routes_1 = __importDefault(require("./iview_management/routes/candidate.routes"));
const video_routes_1 = __importDefault(require("./iview_management/routes/video.routes"));
dotenv_1.default.config(); // .env dosyasını yükle
if (!process.env.PORT) {
    console.warn("Warning: PORT environment variable is not defined.");
}
if (!process.env.DB_URI) {
    console.error("Error: MONGO_URI is required to connect to the database.");
    process.exit(1); // Uygulama durdurulur
}
// CORS ayarları için tanımlı environment değişkenlerini kontrol ediyoruz
const corsOrigins = [process.env.CORS_ORIGIN, process.env.CORS_USER].filter((origin) => !!origin);
const app = (0, express_1.default)();
// Proxy ayarlarını yapıyoruz (X-Forwarded-For başlığını düzgün şekilde almak için)
app.set('trust proxy', 1); // Eğer proxy katmanı varsa, burada uygun değeri seçebilirsiniz
(0, db_1.connectDB)();
if (corsOrigins.length === 0) {
    console.warn("No CORS origins specified, defaulting to '*'");
}
// CORS, body parser ve diğer middleware'ler
app.use((0, cors_1.default)({
    origin: corsOrigins.length ? corsOrigins : "*", // "*": herkese izin verir.
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
// JSON body parser middleware'ini ekliyoruz
app.use(express_1.default.json()); // JSON verilerini parse etmek için
app.use(express_1.default.urlencoded({ extended: true })); // URL encoded verileri parse etmek için
// Router ayarları
app.use("/api/register", register_routes_1.default); // admin kaydı için
app.use("/api/auth", auth_routes_1.default); // Auth işlemleri için
app.use("/api/questions", question_routes_1.default); // Soru yönetimi için
app.use("/api/iview", iview_routes_1.default);
app.use("/api/candidate", candidate_routes_1.default);
app.use('/api/videos', video_routes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
