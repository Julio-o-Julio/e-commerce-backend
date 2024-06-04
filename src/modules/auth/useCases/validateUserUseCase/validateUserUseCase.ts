import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserRepository } from './../../../../modules/user/repositories/UserRepository';
import { AuthValueIncorrectException } from '../../exceptions/authValueIncorrectException';

interface ValidateUserRequest {
  email: string;
  password: string;
}

@Injectable()
export class ValidateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, password }: ValidateUserRequest) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new AuthValueIncorrectException();

    const isPasswordMathed = await compare(password, user.password);

    if (!isPasswordMathed) throw new AuthValueIncorrectException();

    return user;
  }
}
