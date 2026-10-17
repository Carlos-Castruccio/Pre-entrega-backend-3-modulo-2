import { Router } from 'express';
import * as controller from '../controllers/user.controller.js';

const router = Router();
router.get('/', controller.getAll);
router.get('/:uid', controller.getById);
router.post('/', controller.create);
router.put('/:uid', controller.update);
router.delete('/:uid', controller.remove);

export default router;
