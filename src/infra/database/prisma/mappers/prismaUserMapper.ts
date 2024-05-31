import { User } from './../../../../modules/user/entities/User';
import { User as UserRaw } from '@prisma/client';

export class PrismaUserMapper {
  static toPrisma({ id, name, email, password, createdAt }: User): UserRaw {
    return {
      id,
      name,
      email,
      password,
      createdAt,
    };
  }

  static toDomain({ id, name, email, password, createdAt }: UserRaw): User {
    return new User(
      {
        name,
        email,
        password,
        createdAt,
      },
      id,
    );
  }
}
