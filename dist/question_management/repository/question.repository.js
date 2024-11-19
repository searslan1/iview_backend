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
exports.QuestionRepository = void 0;
const question_1 = require("../entity/question");
class QuestionRepository {
    create(questionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newQuestion = new question_1.Question(questionData);
            return yield newQuestion.save();
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield question_1.Question.find();
        });
    }
    findById(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield question_1.Question.findById(questionId);
        });
    }
    update(questionId, questionData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield question_1.Question.findByIdAndUpdate(questionId, questionData, {
                new: true,
            });
        });
    }
    // Tüm tag'leri almak
    getAllTags() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield question_1.Question.distinct("tags"); // 'tags' alanındaki tüm benzersiz değerleri alır
        });
    }
    // Belirli bir tag'e göre soruları ve süreleri getirmek
    getQuestionsByTag(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield question_1.Question.find({ tags: tag })
                .select("questionText duration") // Sadece 'questionText' ve 'duration' alanlarını seçiyoruz
                .lean();
        });
    }
    delete(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield question_1.Question.findByIdAndDelete(questionId);
        });
    }
    updateOrder(questionId, order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield question_1.Question.findByIdAndUpdate(questionId, { order });
        });
    }
}
exports.QuestionRepository = QuestionRepository;
