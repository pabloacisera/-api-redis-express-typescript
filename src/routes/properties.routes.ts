import Router from 'express'
import { PropertiesController } from '../controllers/PropertiesController'

const router = Router()
const propController = new PropertiesController()

router.post('/create', async (req, res, next) => {
  await propController.createProperty(req, res).catch(next)
})

export default router