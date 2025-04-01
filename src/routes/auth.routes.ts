import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { RecoveryPasswordController } from '../controllers/RecoveryPasswordController';

const router = Router();
const controller = new AuthController();
const verifiedController = new RecoveryPasswordController()

router.post('/register', (req, res, next) => {
  controller.register(req, res).catch(next);
});

router.post('/login', (req, res, next) => {
  controller.login(req, res).catch(next);
});

router.get('/confirm_email/:id', (req, res, next) => {
  controller.confirmationEmail(req, res).catch(next);
});


// Recuperación de contraseña
router.post('/recovery/send-code', (req, res, next) => {
  verifiedController.sendCode(req, res).catch(next);
});

router.post('/recovery/reset-password', (req, res, next) => {
  verifiedController.resetPassword(req, res).catch(next);
});

export default router;
