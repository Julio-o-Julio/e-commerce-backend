import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserRepository } from './../../../../modules/user/repositories/UserRepository';

interface ValidateUserRequest {
  email: string;
  password: string;
}

@Injectable()
export class ValidateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, password }: ValidateUserRequest) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new UnauthorizedException('Email ou senha incorretos');

    const isPasswordMathed = await compare(password, user.password);

    if (!isPasswordMathed)
      throw new UnauthorizedException('Email ou senha incorretos');

    return user;
  }
}