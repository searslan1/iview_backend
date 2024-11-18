import mongoose from 'mongoose';
import { config } from '../common/config/config';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.dbUri, {
    });
    console.log('MongoDB bağlantısı başarılı');
  } catch (error) {
    console.error('MongoDB bağlantısı başarısız:', error);
    process.exit(1); // Uygulamayı durdur
  }
};
