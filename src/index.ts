import chalk from 'chalk';
import express from 'express';
import morgan from 'morgan';
import { envs } from './configuration/environments';
import connectRedis from './configuration/redis.config';
import { authMiddleware } from './middlewares/authMiddlewares';
import authRoutes from './routes/auth.routes';
import ownerRoutes from './routes/owner.routes';
import excelRoutes from './routes/excel.routes'

const app = express();
const port = envs.PORT;

// Conexión a Redis
connectRedis();

app.use(morgan('dev'));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api/owners', authMiddleware, ownerRoutes);
app.use('/api/excel', authMiddleware, excelRoutes)

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

  // Login
  console.log(chalk.bold('\n📮 POST /auth/login'));
  console.log(chalk.gray('├── ') + chalk.white('Request Body:'));
  console.log(chalk.gray('│    ') + chalk.cyan(JSON.stringify({
    email: "usuario@ejemplo.com",
    password: "contraseñaSegura123"
  }, null, 2).replace(/\n/g, '\n│    ')));
  console.log(chalk.gray('└── ') + chalk.white('Response:'));
  console.log(chalk.gray('     ') + chalk.cyan(JSON.stringify({
    success: true,
    message: "Login exitoso",
    user: {
      id: 1,
      name: "Pablo",
      email: "usuario@ejemplo.com",
      role: "admin"
    },
    token: {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }, null, 2).replace(/\n/g, '\n     ')));

  // Register
  console.log(chalk.bold('\n📝 POST /auth/register'));
  console.log(chalk.gray('├── ') + chalk.white('Request Body:'));
  console.log(chalk.gray('│    ') + chalk.cyan(JSON.stringify({
    name: "Usuario Nuevo",
    username: "usuario123",
    email: "nuevo@ejemplo.com",
    password: "contraseñaSegura123",
    role: "user"
  }, null, 2).replace(/\n/g, '\n│    ')));
  console.log(chalk.gray('└── ') + chalk.white('Response:'));
  console.log(chalk.gray('     ') + chalk.cyan(JSON.stringify({
    success: true,
    message: "Usuario registrado, verifica tu email"
  }, null, 2).replace(/\n/g, '\n     ')));

  // Confirm Email
  console.log(chalk.bold('\n✉️ GET /auth/confirm_email/:token'));
  console.log(chalk.gray('└── ') + chalk.white('Response:'));
  console.log(chalk.gray('     ') + chalk.cyan(JSON.stringify({
    success: true,
    message: "Email confirmado exitosamente"
  }, null, 2).replace(/\n/g, '\n     ')));

  // -------------------- OWNERS ROUTES --------------------
  console.log(chalk.bgHex('#bd93f9').white.bold('\n 👑 OWNERS ROUTES '));

  // Create Owner (con todos los campos según modelo)
  console.log(chalk.bold('\n🆕 POST /api/owners/create_owner'));
  console.log(chalk.gray('├── ') + chalk.white('Request Body:'));
  console.log(chalk.gray('│    ') + chalk.cyan(JSON.stringify({
    name: "Empresa SA",
    dni: "30123456",
    cuit: "30-12345678-9",
    age: "30",
    address: "Calle Falsa 123",
    phone: "+5491123456789",
    email: "empresa@ejemplo.com",
    birthDate: "1990-01-01",
    nationality: "Argentina"
  }, null, 2).replace(/\n/g, '\n│    ')));
  console.log(chalk.gray('└── ') + chalk.white('Response:'));
  console.log(chalk.gray('     ') + chalk.cyan(JSON.stringify({
    success: true,
    message: "Owner creado exitosamente",
    data: {
      id: 1,
      name: "Empresa SA",
      dni: "30123456",
      cuit: "30-12345678-9",
      age: "30",
      address: "Calle Falsa 123",
      phone: "+5491123456789",
      email: "empresa@ejemplo.com",
      birthDate: "1990-01-01T00:00:00.000Z",
      nationality: "Argentina",
      createdAt: "2023-01-01T12:00:00.000Z",
      updatedAt: "2023-01-01T12:00:00.000Z"
    }
  }, null, 2).replace(/\n/g, '\n     ')));

  // Get Owner
  console.log(chalk.bold('\n🔍 GET /api/owners/get_owner/:id'));
  console.log(chalk.gray('└── ') + chalk.white('Response:'));
  console.log(chalk.gray('     ') + chalk.cyan(JSON.stringify({
    success: true,
    message: "Owner encontrado",
    data: {
      id: 1,
      name: "Empresa SA",
      dni: "30123456",
      cuit: "30-12345678-9",
      age: "30",
      address: "Calle Falsa 123",
      phone: "+5491123456789",
      email: "empresa@ejemplo.com",
      birthDate: "1990-01-01T00:00:00.000Z",
      nationality: "Argentina",
      createdAt: "2023-01-01T12:00:00.000Z",
      updatedAt: "2023-01-01T12:00:00.000Z"
    }
  }, null, 2).replace(/\n/g, '\n     ')));

  // Update Owner (ejemplo con varios campos actualizables)
  console.log(chalk.bold('\n✏️ PATCH /api/owners/update_owner/:id'));
  console.log(chalk.gray('├── ') + chalk.white('Request Body:'));
  console.log(chalk.gray('│    ') + chalk.cyan(JSON.stringify({
    phone: "+5491123456789",
    address: "Nueva Dirección 456",
    email: "nuevoemail@empresa.com"
  }, null, 2).replace(/\n/g, '\n│    ')));
  console.log(chalk.gray('└── ') + chalk.white('Response:'));
  console.log(chalk.gray('     ') + chalk.cyan(JSON.stringify({
    success: true,
    message: "Owner actualizado",
    data: {
      id: 1,
      phone: "+5491123456789",
      address: "Nueva Dirección 456",
      email: "nuevoemail@empresa.com",
      updatedAt: "2023-01-02T12:00:00.000Z"
    }
  }, null, 2).replace(/\n/g, '\n     ')));

  // Delete Owner
  console.log(chalk.bold('\n🗑️ DELETE /api/owners/delete_owner/:id'));
  console.log(chalk.gray('└── ') + chalk.white('Response:'));
  console.log(chalk.gray('     ') + chalk.cyan(JSON.stringify({
    success: true,
    message: "Owner eliminado exitosamente"
  }, null, 2).replace(/\n/g, '\n     ')));

  // Donwload excel of owners
  console.log(chalk.bold('\n 📥 GET /api/owners/download_documents_owners'));
  console.log(chalk.gray('└── ') + chalk.white('Response:'));
  console.log(chalk.gray('     ') + chalk.cyan(JSON.stringify({
    'Content-Type': 'application / vnd.openxmlformats - officedocument.spreadsheetml.sheet',
    'Content-Disposition': 'attachment; filename=owners.xlsx'
  }, null, 2).replace(/\n/g, '\n     ')));

  // -------------------- EXCEL UPLOAD ROUTE --------------------
  console.log(chalk.bgHex('#ffb86c').black.bold('\n 📤 EXCEL UPLOAD ROUTE '));

  // Upload Excel file
  console.log(chalk.bold('\n📤 POST /api/upload/excel'));
  console.log(chalk.gray('├── ') + chalk.white('Request Headers:'));
  console.log(chalk.gray('│    ') + chalk.cyan('Content-Type: multipart/form-data'));
  console.log(chalk.gray('├── ') + chalk.white('Request Body (form-data):'));
  console.log(chalk.gray('│    ') + chalk.cyan('file: <Excel file> (max 5MB)'));
  console.log(chalk.gray('│    ') + chalk.cyan('Allowed types: .xlsx, .xls'));

  // Footer
  console.log(chalk.hex('#6272a4').italic('\nDeveloped with ❤️ by Pablo'));
  console.log(chalk.gray('─'.repeat(50)));

  // Mensaje de servidor
  console.log(`\n🚀 ${chalk.bold.greenBright('Server running at:')} ${chalk.underline.blue(`http://localhost:${port}`)}\n`);
});
