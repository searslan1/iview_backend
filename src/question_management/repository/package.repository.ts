import { IQuestion, Question } from "../entity/question";
import {
  QuestionPackageRelation,
  IQuestionPackageRelation,
} from "../entity/package";

export class PackageRepository {
  // Yeni bir paket-soru ilişkisi ekleme
  public async addRelation(
    questionText: string,
    packageName: string
  ): Promise<IQuestionPackageRelation> {
    const newRelation = new QuestionPackageRelation({
      questionText,
      packageName,
    });
    return await newRelation.save();
  }

  // Belirli bir pakete ait ilişkileri bulma
  public async findRelationsByPackage(
    packageName: string
  ): Promise<IQuestionPackageRelation[]> {
    return await QuestionPackageRelation.find({ packageName });
  }

  // İlişkili soruların metinlerini çekme
  public async getQuestionTextsByPackage(
    packageName: string
  ): Promise<string[]> {
    const relations = await this.findRelationsByPackage(packageName);
    console.log("Relations:", relations);
    return relations.map((relation) => relation.questionText);
  }

  // Paket-soru ilişkisini güncelleme
  public async updateQuestion(
    questionID: string,
    newQuestionText?: string,
    newDuration?: number
  ): Promise<IQuestion | null> {
    const question = await Question.findById(questionID);

    if (!question) {
      throw new Error("Soru bulunamadı");
    }

    if (newQuestionText !== undefined) {
      question.questionText = newQuestionText;
    }

    if (newDuration !== undefined) {
      question.duration = newDuration;
    }

    await question.save();
    return question;
  }

  // Paket-soru ilişkisini silme
  public async deleteRelation(
    questionText: string,
    packageName: string
  ): Promise<IQuestionPackageRelation | null> {
    return await QuestionPackageRelation.findOneAndDelete({
      questionText,
      packageName,
    });
  }

  // Paket isimlerini çekme
  public async getPackageNames(): Promise<string[]> {
    const packageNames = await Question.distinct("tags");
    return packageNames;
  }

 // Pakete ait ilişkili tüm soruları tam detaylarıyla getiren fonksiyon
 public async getQuestionsByPackage(packageName: string): Promise<IQuestion[]> {
  const relations = await QuestionPackageRelation.find({ packageName });

  const questions = await Promise.all(
    relations.map(async (relation) => {
      const question = await Question.findOne({ questionText: relation.questionText });
      return question?.toObject() as IQuestion; // Türü netleştiriyoruz
    })
  );

  return questions.filter((question): question is IQuestion => !!question);
}
  }

