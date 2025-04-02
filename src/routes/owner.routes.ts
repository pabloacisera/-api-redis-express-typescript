import Router from 'express'
import { OwnerController } from '../controllers/OwnerController'

const router = Router()
const ownerController = new OwnerController()

router.post('/', async (req, res, next) => {
  try {
    await ownerController.createOwner(req, res);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
})

router.get('/', async (req, res, next) => {
  try {
    await ownerController.getAllOwners(req, res)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    await ownerController.getOwnerById(req, res)
  } catch (error) {
    next(error)
  }
})


router.put('/:id', async (req, res, next) => {
  try {
    await ownerController.updateOwner(req, res)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await ownerController.deleteOwner(req, res)
  } catch (error) {
    next(error)
  }
})

export default router