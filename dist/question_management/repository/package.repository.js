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
exports.PackageRepository = void 0;
const question_1 = require("../entity/question");
const package_1 = require("../entity/package");
class PackageRepository {
    // Yeni bir paket-soru ilişkisi ekleme
    addRelation(questionText, packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            const newRelation = new package_1.QuestionPackageRelation({
                questionText,
                packageName,
            });
            return yield newRelation.save();
        });
    }
    // Belirli bir pakete ait ilişkileri bulma
    findRelationsByPackage(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield package_1.QuestionPackageRelation.find({ packageName });
        });
    }
    // İlişkili soruların metinlerini çekme
    getQuestionTextsByPackage(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            const relations = yield this.findRelationsByPackage(packageName);
            console.log("Relations:", relations);
            return relations.map((relation) => relation.questionText);
        });
    }
    // Paket-soru ilişkisini güncelleme
    updateQuestion(questionID, newQuestionText, newDuration) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = yield question_1.Question.findById(questionID);
            if (!question) {
                throw new Error("Soru bulunamadı");
            }
            if (newQuestionText !== undefined) {
                question.questionText = newQuestionText;
            }
            if (newDuration !== undefined) {
                question.duration = newDuration;
            }
            yield question.save();
            return question;
        });
    }
    // Paket-soru ilişkisini silme
    deleteRelation(questionText, packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield package_1.QuestionPackageRelation.findOneAndDelete({
                questionText,
                packageName,
            });
        });
    }
    // Paket isimlerini çekme
    getPackageNames() {
        return __awaiter(this, void 0, void 0, function* () {
            const packageNames = yield question_1.Question.distinct("tags");
            return packageNames;
        });
    }
    // Pakete ait ilişkili tüm soruları tam detaylarıyla getiren fonksiyon
    getQuestionsByPackage(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            const relations = yield package_1.QuestionPackageRelation.find({ packageName });
            const questions = yield Promise.all(relations.map((relation) => __awaiter(this, void 0, void 0, function* () {
                const question = yield question_1.Question.findOne({ questionText: relation.questionText });
                return question === null || question === void 0 ? void 0 : question.toObject(); // Türü netleştiriyoruz
            })));
            return questions.filter((question) => !!question);
        });
    }
}
exports.PackageRepository = PackageRepository;
