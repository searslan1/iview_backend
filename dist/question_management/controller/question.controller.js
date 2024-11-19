"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionController = void 0;
const question_service_1 = require("../service/question.service");
const question_1 = require("../entity/question");
class QuestionController {
    constructor() {
        // Yeni bir soru oluşturma işlemi
        this.createQuestion = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { questionText, tags, duration } = req.body;
                // DTO formatında yeni soruyu oluşturuyoruz
                const newQuestionData = {
                    questionText,
                    tags,
                    duration,
                };
                // DTO'yu kullanarak yeni soruyu kaydediyoruz
                const newQuestion = new question_1.Question(newQuestionData);
                yield newQuestion.save();
                res.status(201).json(newQuestion);
            }
            catch (error) {
                console.error("Error creating question:", error);
                res.status(400).json({
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
        // Tüm soruları getirme işlemi
        this.getAllQuestions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Servis katmanından soruları alıyoruz
                const questions = yield this.questionService.getAllQuestions();
                res.status(200).json(questions); // Doğrudan soruları döndürüyoruz
            }
            catch (error) {
                console.error("Error getting questions:", error);
                res.status(500).json({
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
        // Soru güncelleme işlemi
        this.updateQuestion = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const questionId = req.params.id;
                const { questionText, duration, tags } = req.body;
                // Validate that the tags field is an array
                if (!Array.isArray(tags) || tags.length === 0) {
                    res.status(400).json({ message: "Tags must be a non-empty array" });
                    return;
                }
                // Other validations
                if (!questionId) {
                    res.status(400).json({ message: "Soru ID gerekli" });
                    return;
                }
                if (!questionText || questionText.trim() === "") {
                    res.status(400).json({ message: "Soru metni gerekli" });
                    return;
                }
                // Call the service layer to update the question
                const updatedQuestion = yield this.questionService.updateQuestion(questionId, {
                    questionText,
                    duration,
                    tags, // Pass the validated tags array
                });
                if (!updatedQuestion) {
                    res.status(404).json({ message: "Soru bulunamadı" });
                    return;
                }
                // Successful response
                res
                    .status(200)
                    .json({ message: "Soru başarıyla güncellendi", updatedQuestion });
            }
            catch (error) {
                console.error("Error updating question:", error);
                res
                    .status(500)
                    .json({ message: "Soru güncellenirken bir hata oluştu", error });
            }
        });
        // Belirli bir soruyu ID'ye göre getiren fonksiyon
        this.getQuestionById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const questionId = req.params.id;
                // Veritabanında soruyu bul
                const question = yield question_1.Question.findById(questionId);
                if (!question) {
                    res.status(404).json({ message: "Question not found" });
                    return;
                }
                // Başarılı şekilde soruyu döndür
                res.status(200).json(question);
            }
            catch (error) {
                console.error("Error fetching question:", error);
                res.status(500).json({ message: "Error fetching question", error });
            }
        });
        // Soru silme işlemi
        this.deleteQuestion = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const questionId = req.params.id; // ID URL'den alınıyor
                // Gelen ID kontrol ediliyor
                if (!questionId) {
                    res.status(400).json({ message: "Soru ID gerekli" });
                    return;
                }
                // Service katmanına ID ile istek gönderiyoruz
                const deletedQuestion = yield this.questionService.deleteQuestion(questionId);
                if (!deletedQuestion) {
                    res.status(404).json({ message: "Soru bulunamadı" });
                    return;
                }
                // Başarılı silme yanıtı
                res
                    .status(200)
                    .json({ message: "Soru başarıyla silindi", deletedQuestion });
            }
            catch (error) {
                console.error("Error deleting question:", error);
                res.status(500).json({
                    error: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu",
                });
            }
        });
        this.reorderQuestions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { reorderedQuestions } = req.body;
                // Service katmanına istek gönderiyoruz
                yield this.questionService.reorderQuestions(reorderedQuestions);
                res.status(200).json({ message: "Questions reordered successfully" });
            }
            catch (error) {
                console.error("Error reordering questions in controller:", error);
                res.status(500).json({ message: "Error reordering questions", error });
            }
        });
        // Tüm tag'leri listele
        this.getAllTags = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tags = yield this.questionService.getAllTags();
                res.status(200).json(tags);
            }
            catch (error) {
                console.error("Error fetching tags:", error);
                res.status(500).json({ error: "Failed to fetch tags" });
            }
        });
        // Belirli bir tag'e göre soruları listele
        this.getQuestionsByTag = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { tag } = req.params;
                const questions = yield this.questionService.getQuestionsByTag(tag);
                res.status(200).json(questions); // Sadece 'questionText' ve 'duration' alanlarını döndürüyoruz
            }
            catch (error) {
                console.error("Error fetching questions by tag:", error);
                res.status(500).json({ error: "Failed to fetch questions by tag" });
            }
        });
        this.questionService = new question_service_1.QuestionService();
    }
}
exports.QuestionController = QuestionController;
