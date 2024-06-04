import { Injectable } from '@nestjs/common';
import { AddressRepository } from '../../reposiories/AddressRepository';
import { AddressNotFoundException } from '../../exceptions/AddressNotFoundException';
import { AddressWithoutPermissionException } from '../../exceptions/AddressWithoutPermissionException';

interface GetAddressRequest {
  addressId: string;
  userId: string;
}

@Injectable()
export class GetAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute({ addressId, userId }: GetAddressRequest) {
    const address = await this.addressRepository.findById(addressId);

    if (!address) throw new AddressNotFoundException();

    if (address.userId != userId)
      throw new AddressWithoutPermissionException({ actionName: 'recuperar' });

    return address;
  }
}
