import { IQuestion } from "../entity/question";
import { PackageRepository } from "../repository/package.repository";
import {
  AddRelationDto,
  UpdateRelationDto,
  DeleteRelationDto,
} from "../dto/package.dto";
import { IQuestionPackageRelation } from "../entity/package";

export class PackageService {
  private PackageRepository: PackageRepository;

  constructor() {
    this.PackageRepository = new PackageRepository();
  }

  // Paket-soru ilişkisini ve soruyu güncelleme
  public async updateRelation(
    updateData: UpdateRelationDto
  ): Promise<IQuestion | null> {
    try {
      const { questionID, newQuestionText, newDuration } = updateData;

      // İş mantığı: Gerekli alanlar kontrolü
      if (!questionID) {
        throw new Error("Geçerli bir Soru ID gereklidir.");
      }

      if (newQuestionText === undefined && newDuration === undefined) {
        throw new Error("Güncellenecek bir veri bulunmalıdır.");
      }

      // Soruyu güncelleme işlemi
      return await this.PackageRepository.updateQuestion(
        questionID,
        newQuestionText,
        newDuration
      ); // Artık 'updateQuestion' fonksiyonu questionID üzerinden çalışacak
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Soru güncellenirken hata: ${error.message}`);
      } else {
        throw new Error("Bilinmeyen bir hata oluştu.");
      }
    }
  }

  // Belirli bir pakete ait ilişkili soruları getir
  public async getQuestionsByPackage(
    packageName: string
  ): Promise<IQuestion[]> {
    if (!packageName) {
      throw new Error("Paket adı gereklidir.");
    }

    // Repository'den tam soru nesnelerini çekiyoruz
    const questions = await this.PackageRepository.getQuestionsByPackage(
      packageName
    );

    if (!questions || questions.length === 0) {
      throw new Error("Pakete ait soru bulunamadı.");
    }

    return questions; // Tam soru nesnelerini döndürüyoruz
  }

  // Paket-soru ilişkisini silme
  public async deleteRelation(
    deleteData: DeleteRelationDto
  ): Promise<IQuestionPackageRelation | null> {
    try {
      const { questionText, packageName } = deleteData;

      // İş mantığı: Gerekli alanlar kontrolü
      if (!questionText || !packageName) {
        throw new Error("Soru ID ve paket adı gereklidir.");
      }

      return await this.PackageRepository.deleteRelation(
        questionText,
        packageName
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Paket-soru ilişkisi silinirken hata: ${error.message}`
        );
      } else {
        throw new Error("Bilinmeyen bir hata oluştu.");
      }
    }
  }

  // Paket isimlerini çekme
  public async getPackageNames(): Promise<string[]> {
    try {
      return await this.PackageRepository.getPackageNames();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Paket isimleri alınırken hata oluştu: ${error.message}`
        );
      } else {
        throw new Error("Bilinmeyen bir hata oluştu.");
      }
    }
  }
  public async addRelation(relationData: AddRelationDto) {
    const { questionText, packageName } = relationData;
    return await this.PackageRepository.addRelation(questionText, packageName);
  }
}
