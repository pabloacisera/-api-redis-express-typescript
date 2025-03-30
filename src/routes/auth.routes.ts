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

router.post('/create_code/', (req, res, next) => {
  verifiedController.createCode(req, res).catch(next)
})

export default router;
