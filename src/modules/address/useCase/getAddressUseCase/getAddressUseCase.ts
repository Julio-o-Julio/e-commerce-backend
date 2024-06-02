import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AddressRepository } from '../../reposiories/AddressRepository';

interface GetAddressRequest {
  addressId: string;
  userId: string;
}

export class GetAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute({ addressId, userId }: GetAddressRequest) {
    const address = await this.addressRepository.findById(addressId);

    if (!address) throw new NotFoundException();

    if (address.userId != userId) throw new UnauthorizedException();

    return address;
  }
}
