import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/UserRepository';
import { UserNotFoundException } from '../../exceptions/userNotFoundException';
import { UserWithoutPermissionException } from '../../exceptions/userWithoutPermissionException';

interface UpdateUserNameRequest {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class UpdateUserNameUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ id, name, email }: UpdateUserNameRequest) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new UserNotFoundException();

    if (user.id != id)
      throw new UserWithoutPermissionException({ actionName: 'atualizar' });

    user.name = name;

    await this.userRepository.update(user);

    return user;
  }
}
