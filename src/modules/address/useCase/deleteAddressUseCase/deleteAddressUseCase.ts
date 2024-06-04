import { Injectable } from '@nestjs/common';
import { AddressRepository } from '../../reposiories/AddressRepository';
import { AddressNotFoundException } from '../../exceptions/AddressNotFoundException';
import { AddressWithoutPermissionException } from '../../exceptions/AddressWithoutPermissionException';

interface DeleteAddressRequest {
  addressId: string;
  userId: string;
}

@Injectable()
export class DeleteAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute({ addressId, userId }: DeleteAddressRequest) {
    const address = await this.addressRepository.findById(addressId);

    if (!address) throw new AddressNotFoundException();

    if (address.userId != userId)
      throw new AddressWithoutPermissionException({ actionName: 'deletar' });

    await this.addressRepository.delete(addressId);
  }
}
