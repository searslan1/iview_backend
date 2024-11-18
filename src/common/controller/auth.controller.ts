import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.schema';
import { config } from '../config/config';
import { Request, Response } from 'express';
import { LoginDTO } from '../dto/auth.dto';

export class AuthController {
  // Kullanıcıyı doğrulayıp access ve refresh token döndürme
  public async login(req: Request, res: Response): Promise<void> {
    const { username, password }: LoginDTO = req.body;

    try {
      const user = await User.findOne({ username }) as IUser | null;
      if (!user) {
        res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
        return;
      }

      const accessToken = this.generateAccessToken({ userId: user._id.toString(), username: user.username, role: user.role });
      const refreshToken = this.generateRefreshToken({ userId: user._id.toString() });

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({ success: true, message: 'Başarıyla giriş yapıldı.' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  }

  private generateAccessToken(payload: { userId: string; username: string; role: string }): string {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: '15m' });
  }

  private generateRefreshToken(payload: { userId: string }): string {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
  }

  // Refresh token yenileme
  public async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      res.status(401).json({ message: 'Yetkisiz erişim' });
      return;
    }

    try {
      const decoded = jwt.verify(refreshToken, config.jwtSecret) as { userId: string };
      
      const user = await User.findById(decoded.userId) as IUser | null;
      if (!user) {
        res.status(401).json({ message: 'Kullanıcı bulunamadı' });
        return;
      }

      const newAccessToken = this.generateAccessToken({ userId: user._id.toString(), username: user.username, role: user.role });
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      });
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Token yenileme hatası:', error);
      res.status(403).json({ message: 'Geçersiz token' });
    }
  }

  // Admin rolü verme fonksiyonu
  public async grantAdminRole(req: Request, res: Response): Promise<void> {
    const { username } = req.body;
    try {
      await User.updateOne({ username }, { role: 'admin' });
      res.status(200).json({ message: 'Admin yetkisi başarıyla verildi.' });
    } catch (error) {
      console.error('Admin yetkisi hatası:', error);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  }
}

export const authController = new AuthController();
