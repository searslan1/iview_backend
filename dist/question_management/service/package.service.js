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
exports.PackageService = void 0;
const package_repository_1 = require("../repository/package.repository");
class PackageService {
    constructor() {
        this.PackageRepository = new package_repository_1.PackageRepository();
    }
    // Paket-soru ilişkisini ve soruyu güncelleme
    updateRelation(updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { questionID, newQuestionText, newDuration } = updateData;
                // İş mantığı: Gerekli alanlar kontrolü
                if (!questionID) {
                    throw new Error("Geçerli bir Soru ID gereklidir.");
                }
                if (newQuestionText === undefined && newDuration === undefined) {
                    throw new Error("Güncellenecek bir veri bulunmalıdır.");
                }
                // Soruyu güncelleme işlemi
                return yield this.PackageRepository.updateQuestion(questionID, newQuestionText, newDuration); // Artık 'updateQuestion' fonksiyonu questionID üzerinden çalışacak
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Soru güncellenirken hata: ${error.message}`);
                }
                else {
                    throw new Error("Bilinmeyen bir hata oluştu.");
                }
            }
        });
    }
    // Belirli bir pakete ait ilişkili soruları getir
    getQuestionsByPackage(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!packageName) {
                throw new Error("Paket adı gereklidir.");
            }
            // Repository'den tam soru nesnelerini çekiyoruz
            const questions = yield this.PackageRepository.getQuestionsByPackage(packageName);
            if (!questions || questions.length === 0) {
                throw new Error("Pakete ait soru bulunamadı.");
            }
            return questions; // Tam soru nesnelerini döndürüyoruz
        });
    }
    // Paket-soru ilişkisini silme
    deleteRelation(deleteData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { questionText, packageName } = deleteData;
                // İş mantığı: Gerekli alanlar kontrolü
                if (!questionText || !packageName) {
                    throw new Error("Soru ID ve paket adı gereklidir.");
                }
                return yield this.PackageRepository.deleteRelation(questionText, packageName);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Paket-soru ilişkisi silinirken hata: ${error.message}`);
                }
                else {
                    throw new Error("Bilinmeyen bir hata oluştu.");
                }
            }
        });
    }
    // Paket isimlerini çekme
    getPackageNames() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.PackageRepository.getPackageNames();
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Paket isimleri alınırken hata oluştu: ${error.message}`);
                }
                else {
                    throw new Error("Bilinmeyen bir hata oluştu.");
                }
            }
        });
    }
    addRelation(relationData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { questionText, packageName } = relationData;
            return yield this.PackageRepository.addRelation(questionText, packageName);
        });
    }
}
exports.PackageService = PackageService;
