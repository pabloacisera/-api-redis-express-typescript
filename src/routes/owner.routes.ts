import Router from 'express'
import { OwnerController } from '../controllers/OwnerController'

const router = Router()
const ownerController = new OwnerController()

router.post('/create_owner', (req, res, next) => {
  ownerController.createOwner(req, res).catch(next);
});

router.get('/all_owners', (req, res, next) => {
  ownerController.getAllOwners(req, res).catch(next);
});

router.get('/get_owner/:id', (req, res, next) => {
  ownerController.getOwnerById(req, res).catch(next);
});

router.patch('/update_owner/:id', (req, res, next) => {
  ownerController.updateOwner(req, res).catch(next);
});

router.delete('/delete_owner/:id', (req, res, next) => {
  ownerController.deleteOwner(req, res).catch(next);
});
export default router
