"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const candidate_controller_1 = require("../controller/candidate.controller");
const candidateController = new candidate_controller_1.CandidateController();
const router = (0, express_1.Router)();
// Candidate routes
router.post("/submit", candidateController.createCandidate); // Düzenlendi
router.get("/iview/:id", candidateController.getCandidateByInterviewId); //mülakat idsine göre aday bilgileri ve video url getirme
router.put("/candidates/update/:id", candidateController.updateCandidate);
router.delete("/delete/:id", candidateController.deleteCandidate);
router.get("/candidates/:id/status", candidateController.getCandidateStatus); // Adayın status bilgisi
router.put("/update/:id/status", candidateController.updateCandidateStatus); // Adayın status bilgisi güncellenir
router.get("/interview/:interviewId/stats", candidateController.getCandidateStatsByInterviewId); // Mülakat ID'sine göre aday istatistikleri
exports.default = router;
