import { UserRepository } from '../repository/user.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export class AuthService {
  private userRepository = new UserRepository();

  // JWT token üretme
  private generateToken(payload: { username: string; role: string }): string {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
  }

  // Kullanıcı giriş doğrulama
  public async validateUser(username: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      return false;  // Kullanıcı bulunamazsa false döner
    }

    // Parolayı doğrula
    return await bcrypt.compare(password, user.password);
  }

  // Kullanıcı giriş işlemi (şifre ve token istemciye döndürülmez)
  public async login(username: string, password: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      return { success: false, message: 'Geçersiz kullanıcı adı veya şifre' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Geçersiz kullanıcı adı veya şifre' };
    }

    // Başarı mesajı döner (token veya şifre döndürülmez)
    return { success: true, message: 'Başarıyla giriş yapıldı' };
  }

  // Admin yetkisi verme
  public async grantAdminRole(username: string): Promise<void> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new Error('Kullanıcı bulunamadı.');
    }

    user.role = 'admin';
    await this.userRepository.updateUser(user);
  }
}
