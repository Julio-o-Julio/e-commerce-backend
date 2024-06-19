import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/UserRepository';
import { User } from '../../entities/User';
import { hash } from 'bcryptjs';
import { UserWithSameEmailException } from './../../exceptions/userWithSameEmailException';

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ name, email, password }: CreateUserRequest) {
    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) throw new UserWithSameEmailException();

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: await hash(password, 12),
    });

    await this.userRepository.create(user);

    return user;
  }
}
