"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duration = void 0;
class Duration {
    constructor(seconds) {
        if (seconds <= 0) {
            throw new Error('Süre sıfırdan büyük olmalıdır.');
        }
        this.seconds = seconds;
    }
    // Süreyi saniye cinsinden döndüren fonksiyon
    getSeconds() {
        return this.seconds;
    }
    // Süreyi dakika cinsinden döndüren fonksiyon (isteğe bağlı)
    getMinutes() {
        return Math.floor(this.seconds / 60);
    }
    // İki sürenin eşit olup olmadığını kontrol eden fonksiyon
    equals(other) {
        return this.seconds === other.getSeconds();
    }
}
exports.Duration = Duration;
