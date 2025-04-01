import chalk from 'chalk';
import express from 'express';
import morgan from 'morgan';
import { envs } from './configuration/environments';
import connectRedis from './configuration/redis.config';
import authRoutes from './routes/auth.routes';


const app = express();
const port = envs.PORT;

// Conexión a Redis
connectRedis();

app.use(morgan('dev'));
app.use(express.json());

app.use('/auth', authRoutes);


app.listen(port, () => {
  console.clear();

  // =============== PRESENTACIÓN ===============
  console.log(chalk.bgHex('#1E40AF').bold.white.underline('  FACTURAPP API v1.0  '));
  console.log(chalk.hex('#1E40AF')('──────────────────────────────────────────────\n'));

  // Repositorio GitHub
  console.log(chalk.bold.blue('🔗 GitHub: ') + chalk.underline('https://github.com/pabloacisera/-api-redis-express-typescript.git\n'));

  // Tecnologías
  console.log(chalk.bgHex('#1E293B').white.bold(' 🛠️ TECNOLOGÍAS PRINCIPALES '));
  console.log(chalk.gray('├── ') + chalk.hex('#F97316').bold('Backend:') + ' ' + chalk.white('Express + TypeScript'));
  console.log(chalk.gray('├── ') + chalk.hex('#10B981').bold('Base de Datos:') + ' ' + chalk.white('Prisma + SQLite'));
  console.log(chalk.gray('├── ') + chalk.hex('#DC2626').bold('Caching:') + ' ' + chalk.white('Redis'));
  console.log(chalk.gray('├── ') + chalk.hex('#7C3AED').bold('Autenticación:') + ' ' + chalk.white('JWT + Bcrypt'));
  console.log(chalk.gray('└── ') + chalk.hex('#0EA5E9').bold('Validación:') + ' ' + chalk.white('Zod'));

  // Descripción
  console.log(chalk.bgHex('#4338CA').white.bold('\n 📄 DESCRIPCIÓN '));
  console.log(chalk.gray(' ✔ ') + chalk.white('Autenticación JWT y verificación por email'));
  console.log(chalk.gray(' ✔ ') + chalk.white('Gestión de propietarios (CRUD completo)'));
  console.log(chalk.gray(' ✔ ') + chalk.white('Caché con Redis para alta performance'));
  console.log(chalk.gray(' ✔ ') + chalk.white('Documentación de endpoints integrada'));

  // =============== DOCUMENTACIÓN DE RUTAS ===============
  console.log(chalk.bgHex('#1a1a2e').bold.white('\n ENDPOINTS DISPONIBLES '));

  // -------------------- AUTH ROUTES --------------------
  console.log(chalk.bgHex('#ff79c6').white.bold('\n 🔐 AUTH ROUTES '));

  // Footer
  console.log(chalk.hex('#6272a4').italic('\nDeveloped with ❤️ by Pablo'));
  console.log(chalk.gray('─'.repeat(50)));

  // Mensaje de servidor
  console.log(`\n🚀 ${chalk.bold.greenBright('Server running at:')} ${chalk.underline.blue(`http://localhost:${port}`)}\n`);
});
