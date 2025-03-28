import nodemailer from 'nodemailer';
import { envs } from './environments';

export const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: envs.EMAIL_HOST,
    port: parseInt(envs.EMAIL_PORT),
    auth: {
      user: envs.GOOGLE_USER_APP,
      pass: envs.GOOGLE_PASSWORD_APP
    },
    tls: {
      rejectUnauthorized: false,
    },
    logger: true,
    debug: true
  });

  transporter.verify((error) => {
    if (error) {
      console.error('Error connecting to email server:', error);
    } else {
      console.log('Email server is ready to take messages');
    }
  })
  return transporter
}