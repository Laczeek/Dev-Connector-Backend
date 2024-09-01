import { Router } from 'express';

import authMiddleware from '../middlewares/auth-middleware';
import authController from '../controllers/auth-controller';

const router = Router();

router.get('/', authMiddleware, authController.getAuthenticatedUser);
router.post('/login', authController.login);

export default router;
