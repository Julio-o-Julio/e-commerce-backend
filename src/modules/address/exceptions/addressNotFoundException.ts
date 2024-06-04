import { HttpStatus } from '@nestjs/common';
import { AppException } from '../../../exceptions/appException';

export class AddressNotFoundException extends AppException {
  constructor() {
    super({
      message: 'Endereço não encontrado',
      status: HttpStatus.NOT_FOUND,
    });
  }
}
