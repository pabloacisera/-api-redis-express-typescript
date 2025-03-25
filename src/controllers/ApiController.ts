import { Request, Response } from 'express';
import instance from "../config/http.client";
import { IResponse } from "../interfaces/IResponse";
import { client } from '../config/redis.config';

export class ApiController {
  public async getData(req: Request, res: Response): Promise<void> {
    console.log(`🛂 [CONTROLLER] Procesando solicitud GET /data`);

    try {

      console.log('🔍 Searching data into redis')
      const redisData = await client.get('fake_data');

      if (redisData) {
        console.log('�� Data found in redis')
        res.status(200).json(JSON.parse(redisData));
        return;
      }

      const apiRes = await instance.get<IResponse[]>('/');

      if (!apiRes.data) {
        console.warn('⚠️ [CONTROLLER] La API respondió sin datos');
        throw new Error('Error al obtener datos de la API falsa');
      }

      await client.set('fake_data', JSON.stringify(apiRes.data), {
        EX: 3600,
      })
      
      console.log('✔️ [REDIS] Datos almacenados correctamente');


      console.log(`✔️ [CONTROLLER] Datos obtenidos correctamente (${apiRes.data.length} items)`);
      
      // Versión correcta - no necesitas retornar nada
      res.status(200).json(apiRes.data);
    } catch (error: unknown) {
      console.error(`💥 [CONTROLLER ERROR]`, error);
      
      // Versión correcta - no necesitas retornar nada
      res.status(500).json({
        error: 'Error al obtener datos de la API falsa',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}