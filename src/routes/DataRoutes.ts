import { Router } from 'express';
import { ApiController } from '../controllers/ApiController';

const router = Router();
const controller = new ApiController();

// Versión simplificada y funcional
router.get('/get_fake_data', (req, res, next) => {
  controller.getData(req, res).catch(next);
});

export default router;