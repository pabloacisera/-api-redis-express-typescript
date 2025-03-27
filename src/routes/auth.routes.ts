import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const controller = new AuthController();

// Solución definitiva - versión minimalista
router.post('/register', (req, res, next) => {
  controller.register(req, res).catch(next);
});

export default router;