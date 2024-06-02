import { Address } from '../entities/Address';
import { AddressRepository } from './AddressRepository';

export class AddressRepositoryInMemory implements AddressRepository {
  public addresses: Address[] = [];

  async create(address: Address): Promise<void> {
    this.addresses.push(address);
  }
  async findById(id: string): Promise<Address | null> {
    const address = this.addresses.find((address) => address.id == id);

    if (!address) return null;

    return address;
  }
  async delete(id: string): Promise<void> {
    this.addresses = this.addresses.filter((address) => address.id != id);
  }
  async update(address: Address): Promise<void> {
    const addressIndex = this.addresses.findIndex(
      (currentAddress) => currentAddress.id == address.id,
    );

    if (addressIndex >= 0) this.addresses[addressIndex] = address;
  }
  async findManyByUserId(
    userId: string,
    page: number,
    perPage: number,
  ): Promise<Address[]> {
    return this.addresses
      .filter((address) => address.userId == userId)
      .slice((page - 1) * perPage, page * perPage);
  }
}
