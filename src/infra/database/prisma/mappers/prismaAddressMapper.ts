import { Address as AddressRaw } from '@prisma/client';
import { Address } from '../../../../modules/address/entities/Address';

export class PrismaAddressMapper {
  static toPrisma({
    id,
    postalCode,
    houseNumber,
    description,
    userId,
    createdAt,
  }: Address): AddressRaw {
    return {
      id,
      postalCode,
      houseNumber,
      description,
      userId,
      createdAt,
    };
  }

  static toDomain({
    id,
    postalCode,
    houseNumber,
    description,
    userId,
    createdAt,
  }: AddressRaw): Address {
    return new Address(
      {
        postalCode,
        houseNumber,
        description,
        userId,
        createdAt,
      },
      id,
    );
  }
}
