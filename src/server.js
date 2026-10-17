import app from './app.js';
import { config } from './config/env.config.js';
import { connectDatabase, disconnectDatabase } from './repositories/database.js';

try {
  await connectDatabase(config.mongodbUri);
  const server = app.listen(config.port, () => {
    console.log(`Servidor en http://localhost:${config.port}`);
  });
  server.on('error', async (error) => {
    console.error(`No se pudo abrir el servidor: ${error.code}`);
    await disconnectDatabase();
    process.exitCode = 1;
  });
} catch {
  console.error('No se pudo conectar con MongoDB. Revisá la URI y que la base esté disponible.');
  await disconnectDatabase();
  process.exitCode = 1;
}
