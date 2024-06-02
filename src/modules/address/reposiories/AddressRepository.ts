import { Address } from '../entities/Address';

export abstract class AddressRepository {
  abstract create(address: Address): Promise<void>;
  abstract findById(id: string): Promise<Address | null>;
  abstract delete(id: string): Promise<void>;
  abstract update(address: Address): Promise<void>;
  abstract findManyByUserId(
    userId: string,
    page: number,
    perPage: number,
  ): Promise<Address[]>;
}
