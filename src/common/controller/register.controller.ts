import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user.schema'; // Modelinizin doğru yolunu buraya yazın

export class RegisterController {
  // Yeni kullanıcı kaydetmek için bir metod
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password} = req.body;

      

      // Kullanıcı adı mevcut mu kontrol et
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res.status(400).json({ message: 'Username already exists.' });
        return;
      }

      // Parolayı hashle
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Yeni kullanıcı oluştur ve kaydet
      const newUser = new User({
        username,
        password: hashedPassword,
        role: 'admin'
    
      });

      await newUser.save();

      // Başarılı yanıt gönder
      res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      console.error('Error during user registration:', error);
      const errorMessage = (error as Error).message;
      res.status(500).json({ message: 'Server error during registration.', error: errorMessage });
    }
  }
}
