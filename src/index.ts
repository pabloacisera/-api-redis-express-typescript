import express from 'express';
import morgan from 'morgan';
import { envs } from './configuration/environments';
import authRoutes from './routes/auth.routes';
import ownerRoutes from './routes/owner.routes';
import { authMiddleware } from './middlewares/authMiddlewares'
import chalk from 'chalk'

const app = express();
const port = envs.PORT;

app.use(morgan('dev'));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api/owners', authMiddleware ,ownerRoutes);

app.listen(port, () => {
  // Limpia la consola
  console.clear();
  
  // Banner principal con estilo
  console.log('✨ ' + '='.repeat(50) + ' ✨');
  console.log(`🚀 ${chalk.bold.greenBright('Server running at:')} ${chalk.underline.blue(`http://localhost:${port}`)}`);
  console.log('✨ ' + '='.repeat(50) + ' ✨\n');

  // Sección de rutas con diseño de tarjetas
  console.log(chalk.bgHex('#1a1a2e').bold.white(' ENDPOINTS DISPONIBLES '));
  
  // Tarjeta para /auth
  console.log('\n🔐 ' + chalk.hex('#ff79c6').bold('AUTH ROUTES'));
  console.log(chalk.gray('├──') + ' 📮 ' + chalk.greenBright('/login') + '    ' + chalk.yellow('POST'));
  console.log(chalk.gray('├──') + ' 📝 ' + chalk.greenBright('/register') + ' ' + chalk.yellow('POST'));
  console.log(chalk.gray('└──') + ' ✉️ ' + chalk.greenBright('/confirm_email/:id') + ' ' + chalk.yellow('GET'));

  // Tarjeta para /api/owners
  console.log('\n👑 ' + chalk.hex('#bd93f9').bold('OWNERS ROUTES'));
  console.log(chalk.gray('├──') + ' 🆕 ' + chalk.greenBright('/create_owner') + '    ' + chalk.yellow('POST'));
  console.log(chalk.gray('├──') + ' 📜 ' + chalk.greenBright('/all_owners') + '     ' + chalk.yellow('GET'));
  console.log(chalk.gray('├──') + ' 🔍 ' + chalk.greenBright('/get_owner/:id') + '  ' + chalk.yellow('GET'));
  console.log(chalk.gray('├──') + ' ✏️ ' + chalk.greenBright('/update_owner/:id') + ' ' + chalk.yellow('PATCH'));
  console.log(chalk.gray('└──') + ' 🗑️ ' + chalk.greenBright('/delete_owner/:id') + ' ' + chalk.yellow('DELETE'));

  // Footer estilizado
  console.log('\n' + chalk.hex('#6272a4').italic('Developed with ❤️ by Pablo'));
  console.log(chalk.gray('-'.repeat(50)));
});
