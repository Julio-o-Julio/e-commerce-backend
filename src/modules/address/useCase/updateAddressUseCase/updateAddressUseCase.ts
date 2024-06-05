import { Injectable } from '@nestjs/common';
import { AddressRepository } from '../../reposiories/AddressRepository';
import { AddressWithoutPermissionException } from './../../exceptions/addressWithoutPermissionException';
import { AddressNotFoundException } from './../../exceptions/addressNotFoundException';

interface UpdateAddressRequest {
  addressId: string;
  postalCode: string;
  houseNumber: number;
  description?: string | null;
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

    if (!address) throw new AddressNotFoundException();

    if (address.userId != userId)
      throw new AddressWithoutPermissionException({ actionName: 'atualizar' });

    address.postalCode = postalCode;
    address.houseNumber = houseNumber;
    address.description = description ?? null;

    await this.addressRepository.update(address);

    return address;
  }
}
