import express from 'express';
import morgan from 'morgan';
import { envs } from './configuration/environments';
import authRoutes from './routes/auth.routes';
import { getRegisteredRoutes } from './utils/router.list';

const app = express();
const port = envs.PORT;

app.use(morgan('dev'));
app.use(express.json());

// Registrar rutas
app.use('/auth', authRoutes);

// Iniciar servidor
const server = app.listen(port, () => {
  console.log(`🖥️ Server running on: http://my-domain:${port}`);
  
  // Mostrar rutas disponibles
  const routes = getRegisteredRoutes(app._router);
  console.log('\n🛣️ Available routes:');
  routes.forEach(route => {
    console.log(`• ${route.methods.join(', ')} ${route.path}`);
  });
});