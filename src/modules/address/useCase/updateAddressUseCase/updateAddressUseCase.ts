import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AddressRepository } from '../../reposiories/AddressRepository';

interface UpdateAddressRequest {
  addressId: string;
  postalCode: string;
  houseNumber: number;
  description?: string;
  userId: string;
}

@Injectable()
export class UpdateAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute({
    addressId,
    postalCode,
    houseNumber,
    description,
    userId,
  }: UpdateAddressRequest) {
    const address = await this.addressRepository.findById(addressId);

    if (!address) throw new NotFoundException();

    if (address.userId != userId) throw new UnauthorizedException();

    address.postalCode = postalCode;
    address.houseNumber = houseNumber;
    address.description = description ?? null;

    await this.addressRepository.update(address);

    return address;
  }
}
