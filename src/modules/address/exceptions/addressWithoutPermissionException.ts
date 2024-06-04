import { HttpStatus } from '@nestjs/common';
import { AppException } from '../../../exceptions/appException';

interface AddressWithoutPermissionExceptionProps {
  actionName: string;
}

export class AddressWithoutPermissionException extends AppException {
  constructor({ actionName }: AddressWithoutPermissionExceptionProps) {
    super({
      message: `Sem permissão para ${actionName} este endereço`,
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}
