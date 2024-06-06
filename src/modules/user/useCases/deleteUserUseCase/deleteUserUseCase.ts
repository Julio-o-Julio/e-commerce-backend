import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/UserRepository';
import { UserNotFoundException } from '../../exceptions/userNotFoundException';
import { UserWithoutPermissionException } from '../../exceptions/userWithoutPermissionException';

interface DeleteUserRequest {
  id: string;
  email: string;
}

@Injectable()
export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ id, email }: DeleteUserRequest) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new UserNotFoundException();

    if (user.id != id)
      throw new UserWithoutPermissionException({ actionName: 'deletar' });

    await this.userRepository.delete(id);
  }
}
