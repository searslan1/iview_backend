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
const iview_repository_1 = __importDefault(require("../repository/iview.repository"));
class InterviewService {
    constructor() {
        this.interviewRepository = new iview_repository_1.default();
    }
    createInterview(interviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.interviewRepository.create(interviewData);
        });
    }
    getAllInterviews() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.interviewRepository.getAllInterviews();
        });
    }
    getInterviewByLink(link) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.interviewRepository.findByLink(link);
        });
    }
    getInterviewByUUID(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Service layer UUID:", uuid);
            return yield this.interviewRepository.findByUUID(uuid);
        });
    }
    getInterviewById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.interviewRepository.getInterviewById(id);
        });
    }
    updateInterview(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.interviewRepository.update(id, updateData);
        });
    }
    deleteInterview(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.interviewRepository.delete(id);
        });
    }
}
exports.default = InterviewService;
