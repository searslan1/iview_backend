export class Tag {
    private readonly tagValue: string;
  
    constructor(tagValue: string) {
      if (!tagValue || tagValue.trim().length === 0) {
        throw new Error('Tag boş olamaz.');
      }
      this.tagValue = tagValue.trim();
    }
  
    // Tag değerini döndüren fonksiyon
    public getValue(): string {
      return this.tagValue;
    }
  
    // İki tag’in eşit olup olmadığını kontrol eden fonksiyon
    public equals(other: Tag): boolean {
      return this.tagValue === other.getValue();
    }
  }
  