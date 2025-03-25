import { Request, Response } from 'express';
import instance from "../config/http.client";
import { IResponse } from "../interfaces/IResponse";
import { client } from '../config/redis.config';

/**
 * @swagger
 * tags:
 *   name: Data
 *   description: Fake data for frontend testing
 */
export class ApiController {

  private readonly REDIS_KEY ='fake_data'
  private readonly CACHE_EXPIRATION = 43200

  /**
   * @swagger
   * /get_fake_data:
   *   get:
   *     summary: Get fake data for testing
   *     description: Returns an array of fake data, first checking Redis cache and if not available, queries the external API
   *     tags: [Data]
   *     responses: 
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/FakeData'
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema: 
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: 'Error fetching fake data'
   *                 details:
   *                   type: string
   *                   example: 'Failed to connect to external API'
   */
  public async getData(req: Request, res: Response): Promise<void> {

  
    console.log(`🛂 [CONTROLLER] Request processed: GET /data`);

    try {

      console.log('🔍 Searching data into redis')
      const redisData = await client.get(this.REDIS_KEY);

      if (redisData) {
        console.log('�� Data found in redis')
        res.status(200).json(JSON.parse(redisData));
        return;
      }

      const apiRes = await instance.get<IResponse[]>('/peoples');

      if (!apiRes.data) {
        console.warn('⚠️ [CONTROLLER] API response no data');
        throw new Error('Error to get data');
      }

      await client.set('fake_data', JSON.stringify(apiRes.data), {
        EX: this.CACHE_EXPIRATION,
      })
      
      console.log('✔️ [REDIS] Data charged successfully');


      console.log(`✔️ [CONTROLLER] Data get:  (${apiRes.data.length} items)`);
      
      // Versión correcta - no necesitas retornar nada
      res.status(200).json(apiRes.data);
    } catch (error: unknown) {
      console.error(`💥 [CONTROLLER ERROR]`, error);
      
      // Versión correcta - no necesitas retornar nada
      res.status(500).json({
        error: 'Error to get data at API',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * @swagger
   * /create_fake_data:
   *   post:
   *     summary: Create new fake data
   *     description: Creates a new fake data record and updates Redis cache
   *     tags: [Data]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/FakeData'
   *     responses:
   *       201:
   *         description: Data created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/FakeData'
   *       500:
   *         description: Internal Server Error
   */
  public async createData(req: Request, res: Response): Promise<void> {
    console.log(`🛂 [CONTROLLER] Request processed: POST /data`)

    try {

      const newData = req.body
      const apiRes = await instance.post<IResponse>('/peoples', newData)
      const createdData = apiRes.data

      if (!createdData) {
        console.warn('���️ [CONTROLLER] API not reponse data');
        throw new Error('Erro to response data');
      }

      const id = `$(this.REDIS_KEY):$(createdData.id)`
      await client.set(id, JSON.stringify(createdData), {
        EX: this.CACHE_EXPIRATION,
      })

      await client.del(this.REDIS_KEY)

      console.log(`✔️ [CONTROLLER] Data created successfully with id: (${createdData.id})`);

      res.status(201).json({
        "user created": {
          id: createdData.id,
          name: createdData.name,
          address: createdData.direccion,
          birthdate: createdData.nacimiento,
        }
      })

    } catch (error: unknown) {
      console.error(`💥 [CONTROLLER ERROR]`, error);
      res.status(500).json({
          error: 'Error to create user data',
          details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  public async getDataById(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    console.log(`🛂 [CONTROLLER] Procesando solicitud GET /data/${id}`)

    try{
      const redisData = await client.get(`$(this.REDIS_KEY):${id}`)

      if (redisData) {
        console.log('�� Data found in redis')
        res.status(200).json(JSON.parse(redisData));
        return;
      }

      const apiRes = await instance.get<IResponse>(`/peoples/${id}`)

      if (!apiRes.data) {
        console.warn('���️ [CONTROLLER] API no data');
        throw new Error('Error to get data');
      }

      await client.set(`$(this.REDIS_KEY):${id}`, JSON.stringify(apiRes.data), {
        EX: this.CACHE_EXPIRATION,
      })

      console.log('✔️ [REDIS] Data charged successfully');

      res.status(200).json(apiRes.data);
    } catch(error){
      console.error(`💥 [CONTROLLER ERROR]`, error);
      res.status(500).json({
        error: 'Error fetching data by ID',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}