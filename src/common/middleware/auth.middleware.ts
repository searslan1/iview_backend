import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config/config';

declare module 'express' {
  export interface Request {
    user?: JwtPayload & { role?: string };
  }
}

// Kimlik doğrulama middleware
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Yetkisiz' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (typeof decoded === 'string') {
      res.status(403).json({ message: 'Geçersiz token formatı' });
      return;
    }

    req.user = decoded as JwtPayload & { role?: string };
    next();
  } catch  {
    res.status(403).json({ message: 'Geçersiz token' });
  }
};

// Admin yetkisi gerektiren işlemler için middleware
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Yetkisiz işlem: admin rolü gerekli' });
    return;
  }
  next();
};

// Master yetkisi gerektiren işlemler için middleware
export const authorizeMaster = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'master') {
    res.status(403).json({ message: 'Yetkisiz işlem: master rolü gerekli' });
    return;
  }
  next();
};

// Hem admin hem de master rollerine izin veren middleware
export const authorizeAdminOrMaster = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'master')) {
    res.status(403).json({ message: 'Yetkisiz işlem: admin veya master rolü gerekli' });
    return;
  }
  next();
};

// Hem user hem de admin rollerine izin veren middleware
export const authorizeUserOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || (req.user.role !== 'user' && req.user.role !== 'admin')) {
    res.status(403).json({ message: 'Yetkisiz işlem: user veya admin rolü gerekli' });
    return;
  }
  next();
};

// Dinamik rol yetkilendirme middleware
export const authorizeRole = (role: string) => (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== role) {
    res.status(403).json({ message: `Yetkisiz işlem: ${role} rolü gerekli` });
    return;
  }
  next();
};
