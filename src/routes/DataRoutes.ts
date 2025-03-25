import { Router } from 'express';
import { ApiController } from '../controllers/ApiController';

const router = Router();
const controller = new ApiController();

// Versión simplificada y funcional
router.get('/data', (req, res, next) => {
  controller.getData(req, res).catch(next);
});

router.get('/data/:id', (req, res, next) => {
  controller.getDataById(req, res).catch(next);
})

router.post('/data', (req, res, next) => {
  controller.createData(req, res).catch(next);
})

export default router;