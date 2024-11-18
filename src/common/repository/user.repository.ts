import { User, IUser } from '../models/user.schema';
import bcrypt from 'bcrypt';

export class UserRepository {
  // Veritabanından kullanıcıyı kullanıcı adıyla bul
  public async findByUsername(username: string): Promise<IUser | null> {
    try {
      return await User.findOne({ username });
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw new Error('Veritabanında kullanıcı aranırken bir hata oluştu.');
    }
  }

  // Kullanıcı bilgilerini güncelle
  public async updateUser(user: IUser): Promise<void> {
    try {
      await user.save();
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Kullanıcı güncellenirken bir hata oluştu.');
    }
  }

  // Yeni kullanıcı ekle
  public async addUser(user: IUser): Promise<IUser> {
    try {
      const saltRounds = 10;
      user.password = await bcrypt.hash(user.password, saltRounds); // Şifreyi hashle

      const newUser = new User(user);
      return await newUser.save();
    } catch (error) {
      console.error('Error adding new user:', error);
      throw new Error('Yeni kullanıcı eklenirken bir hata oluştu.');
    }
  }
}
