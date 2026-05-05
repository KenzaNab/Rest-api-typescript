import request from 'supertest';
import app from '../src/app';

// Mock Prisma
jest.mock('../src/config/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    post: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import prisma from '../src/config/prisma';

const mockUser = {
  id: 'user-1',
  name: 'Kenza',
  email: 'kenza@test.com',
  role: 'USER',
  createdAt: new Date(),
  _count: { posts: 0 },
};

describe('GET /health', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('POST /api/auth/register', () => {
  it('returns 400 with invalid data', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'bad', password: '123' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('registers a new user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
    const res = await request(app).post('/api/auth/register').send({
      name: 'Kenza', email: 'kenza@test.com', password: 'password123'
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });
});

describe('POST /api/auth/login', () => {
  it('returns 400 with empty body', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });
});

describe('GET /api/posts', () => {
  it('returns list of posts', async () => {
    (prisma.post.findMany as jest.Mock).mockResolvedValue([]);
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('GET /api/posts/:id', () => {
  it('returns 404 for unknown post', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/api/posts/unknown-id');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/posts', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).post('/api/posts').send({ title: 'Test', content: 'Test content' });
    expect(res.status).toBe(401);
  });
});
