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
exports.PackageController = void 0;
const package_service_1 = require("../service/package.service");
class PackageController {
    constructor() {
        this.packageService = new package_service_1.PackageService();
    }
    // Seçilen pakete ait soruları listeleyen fonksiyon
    getQuestionsByPackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { packageName } = req.query;
                if (!packageName) {
                    res.status(400).json({ message: "Paket adı gerekli" });
                    return;
                }
                // Servis katmanından pakete ait tüm soru nesnelerini çekiyoruz
                const questions = yield this.packageService.getQuestionsByPackage(packageName);
                res.status(200).json(questions); // Soru nesnelerini frontend'e dönüyoruz
            }
            catch (error) {
                console.error("Error fetching questions:", error);
                res.status(500).json({
                    message: "Sorular listelenirken bir hata oluştu",
                    error,
                });
            }
        });
    }
    // Paket-soru ilişkisini ve süresini güncelleme
    updateRelation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { questionID, newQuestionText, newDuration } = req.body;
                // Gerekli verilerin varlığını kontrol et
                if (!questionID ||
                    (newQuestionText === undefined && newDuration === undefined)) {
                    res.status(400).json({
                        message: "Geçerli bir Soru ID ve güncellenmiş veri gerekli.",
                    });
                    return;
                }
                const updatedQuestion = yield this.packageService.updateRelation({
                    questionID, // Güncellenen sorunun kimliği
                    newQuestionText,
                    newDuration,
                });
                if (!updatedQuestion) {
                    res.status(404).json({ message: "Soru bulunamadı." });
                    return;
                }
                res.status(200).json({
                    message: "Soru başarıyla güncellendi.",
                    updatedQuestion,
                });
            }
            catch (error) {
                console.error("Error updating relation:", error);
                res.status(500).json({
                    message: "Soru güncellenirken bir hata oluştu.",
                    error,
                });
            }
        });
    }
    // Paket-soru ilişkisini silme
    deleteRelation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { questionText, packageName } = req.body;
                if (!questionText || !packageName) {
                    res.status(400).json({ message: "Soru ID ve paket adı gerekli" });
                    return;
                }
                const deletedRelation = yield this.packageService.deleteRelation({
                    questionText,
                    packageName,
                });
                if (!deletedRelation) {
                    res.status(404).json({
                        message: "Soru bulunamadı veya paket ilişkisi mevcut değil",
                    });
                    return;
                }
                res.status(200).json({
                    message: "Paket-soru ilişkisi başarıyla silindi",
                });
            }
            catch (error) {
                console.error("Error deleting relation:", error);
                res.status(500).json({
                    message: "Paket-soru ilişkisi silinirken bir hata oluştu",
                    error,
                });
            }
        });
    }
    getPackageNames(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packageNames = yield this.packageService.getPackageNames();
                res.status(200).json(packageNames);
            }
            catch (error) {
                console.error("Error fetching package names:", error);
                res
                    .status(500)
                    .json({ message: "Paket isimleri alınırken bir hata oluştu", error });
            }
        });
    }
    // Paket-soru ilişkisi ekleme
    addRelation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { questionText, packageName } = req.body;
                if (!questionText || !packageName) {
                    res.status(400).json({ message: "Soru ve paket adı gereklidir" });
                    return;
                }
                const newRelation = yield this.packageService.addRelation({
                    questionText,
                    packageName,
                });
                res.status(200).json(newRelation);
            }
            catch (error) {
                console.error("Error adding relation:", error);
                res
                    .status(500)
                    .json({ message: "İlişki eklenirken bir hata oluştu", error });
            }
        });
    }
}
exports.PackageController = PackageController;
