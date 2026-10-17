import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products.router.js';
import usersRouter from './routes/users.router.js';
import mocksRouter from './routes/mocks.router.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'success', message: 'ShipNow funcionando' }));
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/mocks', mocksRouter);

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Ruta no encontrada' });
});
app.use(errorHandler);

export default app;
