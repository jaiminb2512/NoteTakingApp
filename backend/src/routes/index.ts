import { Router } from 'express';
import userRoutes from './user.routes';
import noteRoutes from './note.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/notes', noteRoutes);

export default router;
