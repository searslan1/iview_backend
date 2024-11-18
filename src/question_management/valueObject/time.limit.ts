export class Duration {
    private readonly seconds: number;
  
    constructor(seconds: number) {
      if (seconds <= 0) {
        throw new Error('Süre sıfırdan büyük olmalıdır.');
      }
      this.seconds = seconds;
    }
  
    // Süreyi saniye cinsinden döndüren fonksiyon
    public getSeconds(): number {
      return this.seconds;
    }
  
    // Süreyi dakika cinsinden döndüren fonksiyon (isteğe bağlı)
    public getMinutes(): number {
      return Math.floor(this.seconds / 60);
    }
  
    // İki sürenin eşit olup olmadığını kontrol eden fonksiyon
    public equals(other: Duration): boolean {
      return this.seconds === other.getSeconds();
    }
  }
  