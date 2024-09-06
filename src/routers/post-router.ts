import { Router } from 'express';

import authMiddleware from '../middlewares/auth-middleware';
import postController from '../controllers/post-controller';

const router = Router();

// private endpoints
router.use(authMiddleware);
router.post('/', postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:pid', postController.getSinglePost);
router.delete('/:pid', postController.deletePost);

router.put('/:pid/like', postController.likeOrUnlikePost);

router.post('/:pid/comment', postController.addCommentToPost);
router.delete('/:pid/comment/:cid', postController.removeCommentFromPost);

export default router;
