import Router from 'express'
import { ExcelController } from '../controllers/ExcelController'

const router = Router()
const excelController = new ExcelController()

router.post('/', (req, res, next) => {
  excelController.generateExcel(req, res).catch(next)
})

export default router