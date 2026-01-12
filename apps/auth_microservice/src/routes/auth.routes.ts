import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

router.post('/login', authController.login);
router.post('/validate', authController.validate);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/register', authController.register);
router.get('/oauth/initiate', authController.initiateOAuth);
router.post('/oauth/exchange-code', authController.exchangeCode);

export default router;