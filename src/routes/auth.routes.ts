import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const controller = new AuthController();

// Solución definitiva - versión minimalista
router.post('/register', (req, res, next) => {
  controller.register(req, res).catch(next);
});

router.post('/login', (req, res, next) => {
  controller.login(req, res).catch(next);
});

router.get('/confirm_email/:id', (req, res, next) => {
  controller.confirmationEmail(req, res).catch(next);
});

export default router;