"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInterviewDTO = void 0;
class CreateInterviewDTO {
    constructor({ title, date, questions, status, link }) {
        this.title = title || '';
        this.date = date || new Date();
        this.questions = questions || [];
        this.status = status || 'live';
        this.link = link;
    }
}
exports.CreateInterviewDTO = CreateInterviewDTO;
