import { Router } from 'express';

import userController from '../controllers/user-controller';

const router = Router();

router.post('/', userController.registerUser);

export default router;
