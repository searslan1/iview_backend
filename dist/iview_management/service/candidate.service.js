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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const candidate_repository_1 = __importDefault(require("../repository/candidate.repository"));
const candidate_schema_1 = require("../models/candidate.schema");
const candidateRepository = new candidate_repository_1.default();
class CandidateService {
    createCandidate(candidateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidateRepository.create(candidateData);
        });
    }
    getCandidateByInterviewId(interviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidates = yield candidateRepository.findByInterviewId(interviewId);
            return yield candidateRepository.getPresignedUrlsForCandidates(candidates); // Presigned URL'leri aday bilgilerine ekleyerek döndür
        });
    }
    updateCandidate(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidateRepository.update(id, updateData);
        });
    }
    deleteCandidate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidateRepository.delete(id);
        });
    }
    getCandidatesByInterviewId(interviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidate_schema_1.Candidate.find({ interview: interviewId }).populate('interview');
        });
    }
    getCandidateById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidateRepository.findById(id);
        });
    }
    getTotalCandidatesByInterviewId(interviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidateRepository.countCandidatesByInterviewId(interviewId);
        });
    }
    getPendingCandidatesByInterviewId(interviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidateRepository.countPendingCandidatesByInterviewId(interviewId);
        });
    }
}
exports.default = CandidateService;
