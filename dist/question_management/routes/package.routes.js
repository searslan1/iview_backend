"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const package_controller_1 = require("../controller/package.controller");
const router = (0, express_1.Router)();
const packageController = new package_controller_1.PackageController();
// Belirli bir pakete ait ilişkili soruları getirme
router.get("/questions", (req, res) => {
    packageController.getQuestionsByPackage(req, res);
});
//paket adı select
router.get("/package-names", (req, res) => {
    packageController.getPackageNames(req, res);
});
// Paket-soru ilişkisini güncelleme
router.put("/update-relation", (req, res) => {
    packageController.updateRelation(req, res);
});
// Paket-soru ilişkisini silme
router.delete("/delete-relation", (req, res) => {
    packageController.deleteRelation(req, res);
});
// Yeni paket-soru ilişkisi ekleme
router.post("/add-relation", (req, res) => {
    packageController.addRelation(req, res);
});
exports.default = router;
