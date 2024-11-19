"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCandidateDTO = void 0;
class CreateCandidateDTO {
    constructor(data) {
        this.name = data.name;
        this.surname = data.surname;
        this.phoneNumber = data.phoneNumber;
        this.email = data.email;
        this.kvkkApproval = data.kvkkApproval;
        this.videoUrl = data.videoUrl;
        this.status = data.status || "pending";
        this.note = data.note || "";
        this.interview = data.interview;
    }
}
exports.CreateCandidateDTO = CreateCandidateDTO;
