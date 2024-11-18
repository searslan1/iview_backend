export interface AddRelationDto {
    questionText: string;
    packageName: string;
  }
  
  export interface UpdateRelationDto {
    questionID: string; // Soru ID'si
    newQuestionText?: string; // Yeni soru metni
    newDuration?: number; // Yeni süre
  }

  
  export interface DeleteRelationDto {
    questionText: string;
    packageName: string;
  }
  