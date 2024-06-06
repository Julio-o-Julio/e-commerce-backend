import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/UserRepository';
import { UserNotFoundException } from '../../exceptions/userNotFoundException';
import { UserWithoutPermissionException } from '../../exceptions/userWithoutPermissionException';
import { hash } from 'bcrypt';

interface UpdateUserPasswordRequest {
  id: string;
  email: string;
  password: string;
}

@Injectable()
export class UpdateUserPasswordUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ id, email, password }: UpdateUserPasswordRequest) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new UserNotFoundException();

    if (user.id != id)
      throw new UserWithoutPermissionException({ actionName: 'atualizar' });

    user.password = await hash(password, 12);

    await this.userRepository.update(user);
  }
}
