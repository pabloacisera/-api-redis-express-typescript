import Router from 'express'
import { upload } from '../configuration/multer.config'
import { UploadController } from '../controllers/ExcelController'

const router = Router()

router.post('/upload', upload.single('file'), UploadController.uploadExcel)

export default router