"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const question_controller_1 = require("../controller/question.controller");
const router = (0, express_1.Router)();
const questionController = new question_controller_1.QuestionController();
router.post("/create", questionController.createQuestion); // Yeni soru oluştur
router.get("/", questionController.getAllQuestions); // Tüm soruları getir
router.delete("/delete/:id", questionController.deleteQuestion);
router.put("/update/:id", questionController.updateQuestion);
router.post("/reorder", questionController.reorderQuestions);
router.get("/tags", questionController.getAllTags);
router.get("/tag/:tag", questionController.getQuestionsByTag);
router.get("/:id", questionController.getQuestionById); // Belirli bir soruyu getir
exports.default = router;
