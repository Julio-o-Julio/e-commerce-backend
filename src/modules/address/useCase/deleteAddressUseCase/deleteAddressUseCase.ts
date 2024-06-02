import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AddressRepository } from '../../reposiories/AddressRepository';

interface DeleteAddressRequest {
  addressId: string;
  userId: string;
}

export class DeleteAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute({ addressId, userId }: DeleteAddressRequest) {
    const address = await this.addressRepository.findById(addressId);

    if (!address) throw new NotFoundException();

    if (address.userId != userId) throw new UnauthorizedException();

    await this.addressRepository.delete(addressId);
  }
}
