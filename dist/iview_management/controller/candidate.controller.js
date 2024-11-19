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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateController = void 0;
const candidate_service_1 = __importDefault(require("../service/candidate.service"));
const candidate_dto_1 = require("../dto/candidate.dto");
const iview_schema_1 = require("../models/iview.schema");
class CandidateController {
    constructor() {
        this.createCandidate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.body, { uuid } = _a, candidateData = __rest(_a, ["uuid"]);
                // Gelen uuid ve aday verilerini kontrol etmek için
                console.log("Received UUID:", uuid);
                console.log("Received Candidate Data:", candidateData);
                const interview = yield iview_schema_1.Interview.findOne({ link: { $regex: uuid } });
                if (!interview) {
                    res.status(404).json({ error: "Interview not found" });
                    return;
                }
                const candidateDTO = new candidate_dto_1.CreateCandidateDTO(Object.assign(Object.assign({}, candidateData), { interview: interview._id }));
                const newCandidate = yield this.candidateService.createCandidate(candidateDTO);
                // Yeni oluşturulan aday verilerini kontrol etmek için
                console.log("Created Candidate:", newCandidate);
                res.status(201).json(Object.assign({ candidateId: newCandidate._id }, newCandidate.toObject()));
            }
            catch (error) {
                console.error("Error in createCandidate:", error);
                res.status(400).json({
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
        this.getCandidateByInterviewId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: interviewId } = req.params;
                // Aday bilgilerini ve presigned URL'leri al
                const candidatesWithPresignedUrls = yield this.candidateService.getCandidateByInterviewId(interviewId);
                if (candidatesWithPresignedUrls.length === 0) {
                    res.status(404).json({ message: "Bu mülakata ait aday bulunamadı." });
                    return;
                }
                res.status(200).json(candidatesWithPresignedUrls);
            }
            catch (error) {
                res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
            }
        });
        this.updateCandidate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCandidate = yield this.candidateService.updateCandidate(req.params.id, req.body);
                if (!updatedCandidate) {
                    res.status(404).json({ message: "Candidate not found" });
                    return;
                }
                res.status(200).json(updatedCandidate);
            }
            catch (error) {
                res.status(400).json({
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
        this.deleteCandidate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedCandidate = yield this.candidateService.deleteCandidate(req.params.id);
                if (!deletedCandidate) {
                    res.status(404).json({ message: "Candidate not found" });
                    return;
                }
                res
                    .status(200)
                    .json({ message: "Candidate deleted successfully", deletedCandidate });
            }
            catch (error) {
                res.status(500).json({
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
        //adayın status bilgisi döner.
        this.getCandidateStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // URL'den adayın id'sini alıyoruz
                const candidate = yield this.candidateService.getCandidateById(id);
                if (!candidate) {
                    res.status(404).json({ message: "Candidate not found" });
                    return;
                }
                // Adayın sadece status bilgisini döndürüyoruz
                res.status(200).json({ status: candidate.status });
            }
            catch (error) {
                res.status(500).json({
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
        //frontendden gelen yeni statusu günceller
        this.updateCandidateStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // URL'den adayın id'sini alıyoruz
                const { status, note } = req.body; // frontend'den status ve note alıyoruz
                if (!status) {
                    res.status(400).json({ message: "Status is required" });
                    return;
                }
                // `status` ve `note` alanlarını güncellemek için
                const updateData = { status };
                if (note) {
                    updateData.note = note;
                }
                const updatedCandidate = yield this.candidateService.updateCandidate(id, updateData); // `status` ve `note` gönderiliyor
                if (!updatedCandidate) {
                    res.status(404).json({ message: "Candidate not found" });
                    return;
                }
                res.status(200).json(updatedCandidate);
            }
            catch (error) {
                res.status(500).json({
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
        //toplam aday sayısı ve pending aday sayısını alır
        this.getCandidateStatsByInterviewId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { interviewId } = req.params;
                // Toplam aday sayısı ve pending aday sayısını al
                const totalCandidates = yield this.candidateService.getTotalCandidatesByInterviewId(interviewId);
                const pendingCandidates = yield this.candidateService.getPendingCandidatesByInterviewId(interviewId);
                // Sonuçları döndür
                res.status(200).json({
                    totalCandidates,
                    pendingCandidates
                });
            }
            catch (error) {
                res.status(500).json({
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
        this.candidateService = new candidate_service_1.default();
    }
}
exports.CandidateController = CandidateController;
