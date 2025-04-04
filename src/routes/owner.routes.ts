import Router from 'express'
import { upload } from '../configuration/multer.config'
import { OwnerController } from '../controllers/OwnerController'

const router = Router()
const ownerController = new OwnerController()

/**
 * @route POST /
 * @description Create a new owner
 * @descripción Crea un nuevo propietario
 * @body {Object} ownerData - Owner data to create
 * @cuerpo {Object} ownerData - Datos del propietario a crear
 * @returns {Object} Created owner data
 * @retorna {Object} Datos del propietario creado
 */
router.post('/', async (req, res, next) => {
  try {
    await ownerController.createOwner(req, res);
  } catch (error) {
    next(error);
  }
})

/**
 * @route POST /upload/excel
 * @description Upload and import owners from Excel file
 * @descripción Sube e importa propietarios desde archivo Excel
 * @consumes multipart/form-data
 * @param {File} excel - Excel file to import
 * @parametro {File} excel - Archivo Excel a importar
 * @returns {Object} Import results
 * @retorna {Object} Resultados de la importación
 */
router.post('/upload/excel', upload.single('excel'), async (req, res, next) => {
  try {
    await ownerController.importFromExcel(req, res)
  } catch (error) {
    next(error)
  }
})

/**
 * @route GET /
 * @description Get all owners (cached in Redis)
 * @descripción Obtiene todos los propietarios (con caché en Redis)
 * @returns {Array} List of owners
 * @retorna {Array} Lista de propietarios
 */
router.get('/', async (req, res, next) => {
  try {
    await ownerController.getAllOwners(req, res)
  } catch (error) {
    next(error)
  }
})

/**
 * @route GET /:id
 * @description Get owner by ID (cached in Redis)
 * @descripción Obtiene propietario por ID (con caché en Redis)
 * @param {string} id - Owner ID
 * @parametro {string} id - ID del propietario
 * @returns {Object} Owner data
 * @retorna {Object} Datos del propietario
 */
router.get('/:id', async (req, res, next) => {
  try {
    await ownerController.getOwnerById(req, res)
  } catch (error) {
    next(error)
  }
})

/**
 * @route GET /export/excel
 * @description Export all owners to Excel file (download)
 * @descripción Exporta todos los propietarios a archivo Excel (descarga)
 * @produces application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
 * @returns {File} Excel file with owners data
 * @retorna {File} Archivo Excel con datos de propietarios
 */
router.get('/export/excel', async (req, res, next) => {
  try {
    await ownerController.downloadExcelWithOwners(req, res)
  } catch (error) {
    next(error)
  }
})

/**
 * @route GET /model/excel
 * @description Download empty Excel template with predefined columns
 * @descripción Descarga plantilla Excel vacía con columnas predefinidas
 * @body {Object} { tableName: "owners" }
 * @cuerpo {Object} { tableName: "owners" }
 * @produces application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
 * @returns {File} Empty Excel template
 * @retorna {File} Plantilla Excel vacía
 */
router.get('/model/excel', async (req, res, next) => {
  try {
    await ownerController.getModelExcel(req, res)
  } catch (error) {
    next(error)
  }
})

/**
 * @route PUT /:id
 * @description Update owner by ID
 * @descripción Actualiza propietario por ID
 * @param {string} id - Owner ID
 * @parametro {string} id - ID del propietario
 * @body {Object} partialData - Fields to update
 * @cuerpo {Object} partialData - Campos a actualizar
 * @returns {Object} Updated owner data
 * @retorna {Object} Datos del propietario actualizado
 */
router.put('/:id', async (req, res, next) => {
  try {
    await ownerController.updateOwner(req, res)
  } catch (error) {
    next(error)
  }
})

/**
 * @route DELETE /:id
 * @description Delete owner by ID
 * @descripción Elimina propietario por ID
 * @param {string} id - Owner ID
 * @parametro {string} id - ID del propietario
 * @returns {Object} Confirmation message
 * @retorna {Object} Mensaje de confirmación
 */
router.delete('/:id', async (req, res, next) => {
  try {
    await ownerController.deleteOwner(req, res)
  } catch (error) {
    next(error)
  }
})

export default router
