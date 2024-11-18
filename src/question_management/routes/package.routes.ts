import { Router, Request, Response } from "express";
import {
  AddRelationDto,
  UpdateRelationDto,
  DeleteRelationDto,
} from "../dto/package.dto";
import { PackageController } from "../controller/package.controller";

const router = Router();
const packageController = new PackageController();

// Belirli bir pakete ait ilişkili soruları getirme
router.get("/questions", (req: Request, res: Response) => {
  packageController.getQuestionsByPackage(req, res);
});

//paket adı select
router.get("/package-names", (req: Request, res: Response) => {
  packageController.getPackageNames(req, res);
});

// Paket-soru ilişkisini güncelleme
router.put("/update-relation", (req: Request, res: Response) => {
  packageController.updateRelation(req, res);
});

// Paket-soru ilişkisini silme
router.delete("/delete-relation", (req: Request, res: Response) => {
  packageController.deleteRelation(req, res);
});

// Yeni paket-soru ilişkisi ekleme
router.post("/add-relation", (req: Request, res: Response) => {
  packageController.addRelation(req, res);
});

export default router;
