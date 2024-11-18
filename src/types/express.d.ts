import { JwtPayload } from 'jsonwebtoken';

declare module 'express' {
  export interface Request {
    user?: JwtPayload & { role?: string }; // Role ve JWT bilgilerini burada tanımlıyoruz
  }
}
