"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const iview_controller_1 = require("../controller/iview.controller");
const interviewController = new iview_controller_1.InterviewController();
const router = (0, express_1.Router)();
// Interview routes
router.post("/create", interviewController.createInterview);
router.get("/interviews", interviewController.getAllInterviews);
router.get("/:id", interviewController.getInterviewById); // Interview'ı ID'ye göre getir
router.get("/link/:interviewId", interviewController.getInterviewByLink);
router.get("/app/:uuid", interviewController.getInterviewByUUID);
/* router.put("/interviews/:id", interviewController.updateInterview); */
router.delete("/delete/:id", interviewController.deleteInterview);
exports.default = router;
