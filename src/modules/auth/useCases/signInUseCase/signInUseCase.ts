import { Injectable } from '@nestjs/common';
import { UserPayload } from '../../models/userPayload';
import { JwtService } from '@nestjs/jwt';
import { User } from './../../../../modules/user/entities/User';

interface SignInRequest {
  user: User;
}

@Injectable()
export class SignInUseCase {
  constructor(private jwtService: JwtService) {}
  async execute({ user }: SignInRequest) {
    const payload: UserPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toJSON(),
    };

    const jwtToken = this.jwtService.sign(payload);

    return jwtToken;
  }
}
