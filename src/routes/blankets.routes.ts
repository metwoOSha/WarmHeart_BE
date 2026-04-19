import { Router } from 'express';
import { getBlankets, getBlanketById } from '../controllers/blankets.controller.js';

const router = Router();

router.get('/', getBlankets);
router.get('/:id', getBlanketById);

export default router;
