import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT;
const mongodbUri = process.env.MONGODB_URI;
const nodeEnv = process.env.NODE_ENV;

if (!port) {
  throw new Error('Falta la variable PORT en el archivo .env');} 
  
if (!mongodbUri) {
  throw new Error('Falta la variable MONGODB_URI en el archivo .env'); 
}

if (!nodeEnv) {
  throw new Error('Falta la variable NODE_ENV en el archivo .env'); 
}

if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
  throw new Error('PORT debe ser un número entero entre 1 y 65535');
}

if (!mongodbUri.startsWith('mongodb://') && !mongodbUri.startsWith('mongodb+srv://')) {
  throw new Error('MONGODB_URI debe empezar con mongodb:// o mongodb+srv://');
}

if (!['development', 'test', 'production'].includes(nodeEnv)) {
  throw new Error('NODE_ENV debe ser development, test o production');
}

export const config = Object.freeze({
  port: Number(port),
  mongodbUri,
  nodeEnv
});
