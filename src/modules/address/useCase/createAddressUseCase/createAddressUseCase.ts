import { Injectable } from '@nestjs/common';
import { Address } from '../../entities/Address';
import { AddressRepository } from '../../reposiories/AddressRepository';

interface CreateAddressRequest {
  postalCode: string;
  houseNumber: number;
  description?: string | null;
  userId: string;
}

@Injectable()
export class CreateAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute({
    postalCode,
    houseNumber,
    description,
    userId,
  }: CreateAddressRequest) {
    const address = new Address({
      postalCode,
      houseNumber,
      description,
      userId,
    });

    await this.addressRepository.create(address);

    return address;
  }
}
