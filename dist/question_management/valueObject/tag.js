"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tag = void 0;
class Tag {
    constructor(tagValue) {
        if (!tagValue || tagValue.trim().length === 0) {
            throw new Error('Tag boş olamaz.');
        }
        this.tagValue = tagValue.trim();
    }
    // Tag değerini döndüren fonksiyon
    getValue() {
        return this.tagValue;
    }
    // İki tag’in eşit olup olmadığını kontrol eden fonksiyon
    equals(other) {
        return this.tagValue === other.getValue();
    }
}
exports.Tag = Tag;
