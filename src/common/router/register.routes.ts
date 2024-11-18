import { Router } from 'express';
import { RegisterController } from '../controller/register.controller'; // Doğru yolu buraya yazın

const router = Router();
const registerController = new RegisterController();

// Register endpoint
router.post('/', registerController.register.bind(registerController));

export default router;
