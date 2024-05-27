import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/UserRepository';
import { User } from '../../entities/User';
import { hash } from 'bcrypt';

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ name, email, password }: CreateUserRequest) {
    const user = new User({
      name,
      email,
      password: await hash(password, 12),
    });

    await this.userRepository.create(user);

    return user;
  }
}
