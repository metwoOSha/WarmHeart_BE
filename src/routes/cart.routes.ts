import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getCart, addItem, removeItem, updateQuantity } from '../controllers/cart.controller.js';

const router = Router();

router.get('/', authMiddleware, getCart);
router.post('/', authMiddleware, addItem);
router.delete('/:id', authMiddleware, removeItem);
router.patch('/:id', authMiddleware, updateQuantity);

export default router;
