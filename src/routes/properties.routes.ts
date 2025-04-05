import Router from 'express'
import { upload } from '../configuration/multer.config'
import { PropertiesController } from '../controllers/PropertiesController'

const router = Router()
const propController = new PropertiesController()

router.post('/create', async (req, res, next) => {
  await propController.createProperty(req, res).catch(next)
})

router.post('/upload/excel', upload.single('excel'), async (req, res, next) => {
  await propController.importFromExcel(req, res).catch(next)
})

router.get('/download/model', async (req, res, next) => {
  await propController.downloadExcelTemplate(req, res).catch(next)
})

router.get('/', async (req, res, next) => {
  await propController.getAllProperties(req, res).catch(next)
})
export default router