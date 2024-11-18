import { Router } from "express";
import { QuestionController } from "../controller/question.controller";

const router = Router();
const questionController = new QuestionController();

router.post("/create", questionController.createQuestion); // Yeni soru oluştur
router.get("/", questionController.getAllQuestions); // Tüm soruları getir
router.delete("/delete/:id", questionController.deleteQuestion);
router.put("/update/:id", questionController.updateQuestion);
router.post("/reorder", questionController.reorderQuestions);
router.get("/tags", questionController.getAllTags);
router.get("/tag/:tag", questionController.getQuestionsByTag);
router.get("/:id", questionController.getQuestionById); // Belirli bir soruyu getir

export default router;
