import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { RegisterDto, LoginDto } from '../dto/types';

export class AuthService {
  async register(dto: RegisterDto) {
    const exists = await prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new Error('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await prisma.user.create({
      data: { name: dto.name, email: dto.email, password: hashed },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    const token = this.generateToken(user.id, user.email, user.role);
    return { token, user };
  }

  async login(dto: LoginDto) {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    const token = this.generateToken(user.id, user.email, user.role);
    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { posts: true } } },
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  private generateToken(id: string, email: string, role: string): string {
    return jwt.sign({ id, email, role }, process.env.JWT_SECRET!, {
      expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '86400000'),
    });
  }
}

export const authService = new AuthService();
