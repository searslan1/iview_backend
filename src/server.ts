import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { connectDB } from "./db/db";
import commonRouter from "./common/router/auth.routes";
import questionRouter from "./question_management/routes/question.routes";
import registerRoutes from "./common/router/register.routes";
import iviewRoutes from "./iview_management/routes/iview.routes";
import candidateRoutes from "./iview_management/routes/candidate.routes";
import videoRoutes from "./iview_management/routes/video.routes";

dotenv.config();

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
].filter((origin): origin is string => !!origin);

const app = express();
app.set("trust proxy", 1);
connectDB();

app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

app.use(
  cors({
    origin: corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", corsOrigins.join(","));
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(200).end();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/register", registerRoutes);
app.use("/api/auth", commonRouter);
app.use("/api/questions", questionRouter);
app.use("/api/iview", iviewRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/videos", videoRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});
