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
exports.QuestionService = void 0;
const question_repository_1 = require("../repository/question.repository");
const question_1 = require("../entity/question");
class QuestionService {
    constructor() {
        this.questionRepository = new question_repository_1.QuestionRepository();
    }
    createQuestion(questionData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.questionRepository.create(questionData);
        });
    }
    getAllQuestions() {
        return __awaiter(this, void 0, void 0, function* () {
            // Yalnızca `questionText`, `duration`, ve `tags` alanlarını alıyoruz
            return yield question_1.Question.find().select("questionText duration tags").lean();
        });
    }
    updateQuestion(questionId, questionData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.questionRepository.update(questionId, questionData);
        });
    }
    deleteQuestion(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.questionRepository.delete(questionId);
        });
    }
    reorderQuestions(reorderedQuestions) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const question of reorderedQuestions) {
                yield this.questionRepository.updateOrder(question.id, question.order);
            }
            return true;
        });
    }
    // Tüm tag'leri al
    getAllTags() {
        return __awaiter(this, void 0, void 0, function* () {
            // Repository'deki getAllTags metodunu çağırıyoruz
            return yield this.questionRepository.getAllTags();
        });
    }
    // Belirli bir tag'e göre soruları getir
    getQuestionsByTag(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            // Repository'deki getQuestionsByTag metodunu çağırıyoruz
            return yield this.questionRepository.getQuestionsByTag(tag);
        });
    }
}
exports.QuestionService = QuestionService;
