import { Router } from 'express';

import { upload } from '../utils/handle-images';
import userController from '../controllers/user-controller';

const router = Router();

router.post('/',upload.single('avatar'), userController.registerUser);

export default router;
