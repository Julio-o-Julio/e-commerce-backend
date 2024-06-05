import { HttpStatus } from '@nestjs/common';
import { AppException } from '../../../exceptions/appException';

export class UserNotFoundException extends AppException {
  constructor() {
    super({
      message: 'Usuário não encontrado',
      status: HttpStatus.NOT_FOUND,
    });
  }
}
