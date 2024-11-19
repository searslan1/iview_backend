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
const candidate_schema_1 = require("../models/candidate.schema");
const s3Repository_1 = require("./s3Repository");
const mongoose_1 = __importDefault(require("mongoose"));
class CandidateRepository {
    create(candidateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = new candidate_schema_1.Candidate(candidateData);
            return yield candidate.save();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidate_schema_1.Candidate.findById(id);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidate_schema_1.Candidate.find();
        });
    }
    update(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidate_schema_1.Candidate.findByIdAndUpdate(id, updateData, { new: true });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidate_schema_1.Candidate.findByIdAndDelete(id);
        });
    }
    findByInterviewId(interviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidates = yield candidate_schema_1.Candidate.find({ interview: new mongoose_1.default.Types.ObjectId(interviewId) });
            console.log("Candidates Found:", candidates); // Sorgu sonucunu kontrol edin
            return candidates;
        });
    }
    getPresignedUrlsForCandidates(candidates) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Promise.all(candidates.map((candidate) => __awaiter(this, void 0, void 0, function* () {
                const presignedUrl = candidate.videoUrl
                    ? yield (0, s3Repository_1.getPresignedUrlRepository)(candidate.videoUrl)
                    : null; // videoUrl yoksa null olarak döndür
                return Object.assign(Object.assign({}, candidate.toObject()), { videoUrl: presignedUrl });
            })));
        });
    }
    countCandidatesByInterviewId(interviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidate_schema_1.Candidate.countDocuments({ interview: interviewId });
        });
    }
    countPendingCandidatesByInterviewId(interviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidate_schema_1.Candidate.countDocuments({ interview: interviewId, status: "pending" });
        });
    }
}
exports.default = CandidateRepository;
