import { Router } from 'express';
import * as controller from '../controllers/mock.controller.js';

const router = Router();
router.get('/users', controller.preview('users'));
router.get('/drivers', controller.preview('drivers'));
router.get('/orders', controller.preview('orders'));
router.get('/deliveries', controller.preview('deliveries'));
router.get('/lote', controller.preview('lote'));
router.post('/seed', controller.seed);
export default router;
