import prisma from '../config/prisma';
import { CreatePostDto, UpdatePostDto } from '../dto/types';

export class PostService {
  async create(dto: CreatePostDto, authorId: string) {
    return prisma.post.create({
      data: { ...dto, authorId },
      include: { author: { select: { id: true, name: true, email: true } } },
    });
  }

  async findAll(published?: boolean, tag?: string) {
    return prisma.post.findMany({
      where: {
        ...(published !== undefined && { published }),
        ...(tag && { tags: { has: tag } }),
      },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true, email: true } } },
    });
    if (!post) throw new Error('Post not found');
    return post;
  }

  async update(id: string, dto: UpdatePostDto, userId: string) {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) throw new Error('Post not found');
    if (post.authorId !== userId) throw new Error('Not authorized to update this post');
    return prisma.post.update({
      where: { id },
      data: dto,
      include: { author: { select: { id: true, name: true } } },
    });
  }

  async delete(id: string, userId: string) {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) throw new Error('Post not found');
    if (post.authorId !== userId) throw new Error('Not authorized to delete this post');
    await prisma.post.delete({ where: { id } });
  }

  async getMyPosts(authorId: string) {
    return prisma.post.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const postService = new PostService();
