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
exports.uploadVideoController = void 0;
const video_service_1 = require("../service/video.service");
const candidate_schema_1 = require("../models/candidate.schema");
const uploadVideoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file; // Multer ile gelen dosya
        const formId = req.body.formId; // formId frontend'den gelecek ve candidate ID olacak
        if (!file || !formId) {
            res.status(400).send('Dosya veya Form ID eksik.');
            return;
        }
        // formId ile Candidate'i bul
        const candidate = yield candidate_schema_1.Candidate.findById(formId);
        if (!candidate) {
            res.status(404).send('Aday bulunamadı.');
            return;
        }
        // Service katmanına dosya ve formId'yi (candidateId) ilet
        const fileName = yield (0, video_service_1.uploadVideo)(file, formId); // Yalnızca dosya adı döner
        // Candidate'in video URL'sini (dosya adı olarak) güncelle
        candidate.videoUrl = fileName; // Sadece dosya adı kaydedilir
        yield candidate.save(); // Adayın bilgilerini güncelle
        res.status(200).json({ message: "Video başarıyla yüklendi" }); // Sadece mesaj dönülür, URL dönülmez
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
exports.uploadVideoController = uploadVideoController;
