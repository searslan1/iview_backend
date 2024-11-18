import { Request, Response } from "express";
import { Question } from "../entity/question";
import { PackageService } from "../service/package.service";
import { QuestionPackageRelation } from "../entity/package";

export class PackageController {
  private packageService: PackageService;

  constructor() {
    this.packageService = new PackageService();
  }

  // Seçilen pakete ait soruları listeleyen fonksiyon
  public async getQuestionsByPackage(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { packageName } = req.query;

      if (!packageName) {
        res.status(400).json({ message: "Paket adı gerekli" });
        return;
      }

      // Servis katmanından pakete ait tüm soru nesnelerini çekiyoruz
      const questions = await this.packageService.getQuestionsByPackage(
        packageName as string
      );

      res.status(200).json(questions); // Soru nesnelerini frontend'e dönüyoruz
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({
        message: "Sorular listelenirken bir hata oluştu",
        error,
      });
    }
  }

  // Paket-soru ilişkisini ve süresini güncelleme
  public async updateRelation(req: Request, res: Response): Promise<void> {
    try {
      const { questionID, newQuestionText, newDuration } = req.body;

      // Gerekli verilerin varlığını kontrol et
      if (
        !questionID ||
        (newQuestionText === undefined && newDuration === undefined)
      ) {
        res.status(400).json({
          message: "Geçerli bir Soru ID ve güncellenmiş veri gerekli.",
        });
        return;
      }

      const updatedQuestion = await this.packageService.updateRelation({
        questionID, // Güncellenen sorunun kimliği
        newQuestionText,
        newDuration,
      });

      if (!updatedQuestion) {
        res.status(404).json({ message: "Soru bulunamadı." });
        return;
      }

      res.status(200).json({
        message: "Soru başarıyla güncellendi.",
        updatedQuestion,
      });
    } catch (error) {
      console.error("Error updating relation:", error);
      res.status(500).json({
        message: "Soru güncellenirken bir hata oluştu.",
        error,
      });
    }
  }

  // Paket-soru ilişkisini silme
  public async deleteRelation(req: Request, res: Response): Promise<void> {
    try {
      const { questionText, packageName } = req.body;

      if (!questionText || !packageName) {
        res.status(400).json({ message: "Soru ID ve paket adı gerekli" });
        return;
      }

      const deletedRelation = await this.packageService.deleteRelation({
        questionText,
        packageName,
      });

      if (!deletedRelation) {
        res.status(404).json({
          message: "Soru bulunamadı veya paket ilişkisi mevcut değil",
        });
        return;
      }

      res.status(200).json({
        message: "Paket-soru ilişkisi başarıyla silindi",
      });
    } catch (error) {
      console.error("Error deleting relation:", error);
      res.status(500).json({
        message: "Paket-soru ilişkisi silinirken bir hata oluştu",
        error,
      });
    }
  }

  public async getPackageNames(req: Request, res: Response): Promise<void> {
    try {
      const packageNames = await this.packageService.getPackageNames();
      res.status(200).json(packageNames);
    } catch (error) {
      console.error("Error fetching package names:", error);
      res
        .status(500)
        .json({ message: "Paket isimleri alınırken bir hata oluştu", error });
    }
  }
  // Paket-soru ilişkisi ekleme
  public async addRelation(req: Request, res: Response): Promise<void> {
    try {
      const { questionText, packageName } = req.body;

      if (!questionText || !packageName) {
        res.status(400).json({ message: "Soru ve paket adı gereklidir" });
        return;
      }

      const newRelation = await this.packageService.addRelation({
        questionText,
        packageName,
      });

      res.status(200).json(newRelation);
    } catch (error) {
      console.error("Error adding relation:", error);
      res
        .status(500)
        .json({ message: "İlişki eklenirken bir hata oluştu", error });
    }
  }
}
