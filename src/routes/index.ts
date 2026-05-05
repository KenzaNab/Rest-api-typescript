import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { postController } from '../controllers/post.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { RegisterSchema, LoginSchema, CreatePostSchema, UpdatePostSchema } from '../dto/types';

const router = Router();

// Auth
router.post('/auth/register', validate(RegisterSchema), authController.register.bind(authController));
router.post('/auth/login', validate(LoginSchema), authController.login.bind(authController));
router.get('/auth/profile', authenticate, authController.profile.bind(authController));

// Posts
router.get('/posts', postController.findAll.bind(postController));
router.get('/posts/mine', authenticate, postController.myPosts.bind(postController));
router.get('/posts/:id', postController.findById.bind(postController));
router.post('/posts', authenticate, validate(CreatePostSchema), postController.create.bind(postController));
router.put('/posts/:id', authenticate, validate(UpdatePostSchema), postController.update.bind(postController));
router.delete('/posts/:id', authenticate, postController.delete.bind(postController));

export default router;
