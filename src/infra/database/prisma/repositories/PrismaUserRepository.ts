import { PrismaService } from '../prisma.service';
import { PrismaUserMapper } from '../mappers/prismaUserMapper';
import { Injectable } from '@nestjs/common';
import { User } from './../../../../modules/user/entities/User';
import { UserRepository } from './../../../../modules/user/repositories/UserRepository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const userRaw = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({
      data: {
        ...userRaw,
        email: userRaw.email.toLowerCase(),
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async update(user: User): Promise<void> {
    const userRaw = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.update({
      data: userRaw,
      where: { id: userRaw.id },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
