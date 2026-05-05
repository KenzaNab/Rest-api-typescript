import { Request, Response } from 'express';
import { postService } from '../services/post.service';
import { AuthRequest } from '../dto/types';

export class PostController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const post = await postService.create(req.body, req.user!.id);
      res.status(201).json({ success: true, data: post });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const published = req.query.published !== undefined ? req.query.published === 'true' : undefined;
    const tag = req.query.tag as string | undefined;
    const posts = await postService.findAll(published, tag);
    res.json({ success: true, data: posts, count: posts.length });
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const post = await postService.findById(req.params.id);
      res.json({ success: true, data: post });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const post = await postService.update(req.params.id, req.body, req.user!.id);
      res.json({ success: true, data: post });
    } catch (err: any) {
      const status = err.message.includes('authorized') ? 403 : 404;
      res.status(status).json({ success: false, message: err.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await postService.delete(req.params.id, req.user!.id);
      res.status(204).send();
    } catch (err: any) {
      const status = err.message.includes('authorized') ? 403 : 404;
      res.status(status).json({ success: false, message: err.message });
    }
  }

  async myPosts(req: AuthRequest, res: Response): Promise<void> {
    const posts = await postService.getMyPosts(req.user!.id);
    res.json({ success: true, data: posts });
  }
}

export const postController = new PostController();
