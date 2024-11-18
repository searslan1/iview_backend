import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DB_URI) {
  throw new Error('DB_URI tanımlı değil!'); 
}


export const config = {
  masterUsername: process.env.MASTER_USERNAME,
  masterPassword: process.env.MASTER_PASSWORD,
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  dbUri: process.env.DB_URI
};
