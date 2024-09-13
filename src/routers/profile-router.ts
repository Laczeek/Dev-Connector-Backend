import { Router } from 'express';

import authMiddleware from '../middlewares/auth-middleware';
import profileController from '../controllers/profile-controller';

const router = Router();

router.get('/', profileController.getAllProfiles);

router.get('/me', authMiddleware, profileController.getAuthUserProfile);

router.get('/:uid', profileController.getUserProfile);
router.get('/github/:githubName', profileController.getGithubRepos);

router.use(authMiddleware);
router.put('/', profileController.createOrUpdateProfile);
router.delete('/', profileController.deleteProfileAndUser);

router.put('/experience', profileController.addProfileExperience);
router.delete('/experience/:eid', profileController.deleteProfileExperience);

router.put('/education', profileController.addProfileEducation);
router.delete('/education/:eid', profileController.deleteProfileEducation);

export default router;
