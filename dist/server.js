"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = require("./db/db");
const auth_routes_1 = __importDefault(require("./common/router/auth.routes"));
const question_routes_1 = __importDefault(require("./question_management/routes/question.routes"));
const register_routes_1 = __importDefault(require("./common/router/register.routes"));
const iview_routes_1 = __importDefault(require("./iview_management/routes/iview.routes"));
const candidate_routes_1 = __importDefault(require("./iview_management/routes/candidate.routes"));
const video_routes_1 = __importDefault(require("./iview_management/routes/video.routes"));
dotenv_1.default.config();
if (!process.env.PORT) {
    console.error("Error: PORT environment variable is missing.");
    process.exit(1);
}
if (!process.env.DB_URI) {
    console.error("Error: DB_URI environment variable is required.");
    process.exit(1);
}
const corsOrigins = [
    process.env.CORS_ORIGIN || "https://iview-frontend-web.vercel.app",
    process.env.CORS_USER || "https://iview-web-olive.vercel.app",
].filter((origin) => !!origin);
const app = (0, express_1.default)();
app.set("trust proxy", 1);
(0, db_1.connectDB)();
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)({
    origin: corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", corsOrigins.join(","));
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.status(200).end();
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/register", register_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/questions", question_routes_1.default);
app.use("/api/iview", iview_routes_1.default);
app.use("/api/candidate", candidate_routes_1.default);
app.use("/api/videos", video_routes_1.default);
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date() });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});
