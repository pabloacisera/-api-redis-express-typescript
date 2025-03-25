import express from 'express';
import dataRoutes from './routes/DataRoutes';
import expressListEndpoints from 'express-list-endpoints';
import morgan from 'morgan';
import responseTime from 'response-time';
import { connectRedis, client } from './config/redis.config';

const app = express();

async function startServer() {
  try {
    // 1. Conectar a Redis primero
    await connectRedis();
    console.log('✅ [APP] Conexión a Redis establecida');

    // 2. Configurar Express
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(responseTime());
    app.use('', dataRoutes);

    // 3. Iniciar servidor HTTP
    const server = app.listen(4005, () => {
      console.log('🚀 Servidor corriendo en http://localhost:4005/\n');

      // Mostrar todos los endpoints
      const endpoints = expressListEndpoints(app);
      console.log('📡 Endpoints disponibles:');
      
      endpoints.forEach(endpoint => {
        console.log(`🔹 ${endpoint.methods.join(', ')} -> ${endpoint.path}`);
        
        if (endpoint.middlewares && endpoint.middlewares.length > 0) {
          console.log(`   Middlewares: ${endpoint.middlewares.join(', ')}`);
        }
      });
    });

    // Manejar cierre adecuado
    process.on('SIGTERM', () => {
      console.log('🛑 Recibido SIGTERM. Cerrando servidor...');
      server.close(async () => {
        await client.disconnect();
        console.log('🚪 Servidor y conexión Redis cerrados');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('🛑 Recibido SIGINT. Cerrando servidor...');
      server.close(async () => {
        await client.disconnect();
        console.log('🚪 Servidor y conexión Redis cerrados');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ [APP] Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

startServer();
