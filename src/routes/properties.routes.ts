import Router from 'express';
import { PropertiesController } from '../controllers/PropertiesController';

const router = Router()
const propertiesController = new PropertiesController()


router.post('/create_property', (req, res, next) => {
  propertiesController.createProperty(req, res).catch(next);
});

router.get('/all_properties', (req, res, next) => {
  propertiesController.getAllProperties(req, res).catch(next);
});

router.get('/property/:id', (req, res, next) => {
  propertiesController.getPropertyById(req, res).catch(next);
});

router.patch('/update_property/:id', (req, res, next) => {
  propertiesController.updateProperty(req, res).catch(next);
});

router.delete('/delete_property/:id', (req, res, next) => {
  propertiesController.deleteProperty(req, res).catch(next);
});

export default router