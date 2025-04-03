import Router from 'express'
import { upload } from '../configuration/multer.config'
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

router.post('/upload/excel', upload.single('excel'), async (req, res, next) => {
  try {
    await ownerController.downloadExcelWithOwners(req, res)
  } catch (error) {
    next(error)
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

router.get('/import/excel', async (req, res, next) => {
  try {
    await ownerController.downloadExcelWithOwners(req, res)
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