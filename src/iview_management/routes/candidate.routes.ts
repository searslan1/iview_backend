import { Router } from "express";
import { CandidateController } from "../controller/candidate.controller";

const candidateController = new CandidateController();
const router = Router();

// Candidate routes
router.post("/submit", candidateController.createCandidate); // Düzenlendi
router.get("/iview/:id", candidateController.getCandidateByInterviewId); //mülakat idsine göre aday bilgileri ve video url getirme
router.put("/candidates/update/:id", candidateController.updateCandidate);
router.delete("/delete/:id", candidateController.deleteCandidate);
router.get("/candidates/:id/status", candidateController.getCandidateStatus); // Adayın status bilgisi
router.put("/update/:id/status", candidateController.updateCandidateStatus); // Adayın status bilgisi güncellenir
router.get("/interview/:interviewId/stats", candidateController.getCandidateStatsByInterviewId); // Mülakat ID'sine göre aday istatistikleri



export default router;
