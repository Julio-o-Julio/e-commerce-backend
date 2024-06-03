import { Injectable } from '@nestjs/common';
import { Address } from '../../../../modules/address/entities/Address';
import { AddressRepository } from '../../../../modules/address/reposiories/AddressRepository';
import { PrismaAddressMapper } from '../mappers/prismaAddressMapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAddressRepository implements AddressRepository {
  constructor(private prisma: PrismaService) {}

  async create(address: Address): Promise<void> {
    const addressRaw = PrismaAddressMapper.toPrisma(address);

    await this.prisma.address.create({
      data: addressRaw,
    });
  }
  async findById(id: string): Promise<Address | null> {
    const addressRaw = await this.prisma.address.findUnique({ where: { id } });

    if (!addressRaw) return null;

    return PrismaAddressMapper.toDomain(addressRaw);
  }
  async findManyByUserId(
    userId: string,
    page: number,
    perPage: number,
  ): Promise<Address[]> {
    const addresses = await this.prisma.address.findMany({
      where: { userId },
      take: perPage,
      skip: (page - 1) * perPage,
    });

    return addresses.map(PrismaAddressMapper.toDomain);
  }
  async delete(id: string): Promise<void> {
    await this.prisma.address.delete({ where: { id } });
  }
  async update(address: Address): Promise<void> {
    const addressRaw = PrismaAddressMapper.toPrisma(address);

    await this.prisma.address.update({
      data: addressRaw,
      where: { id: addressRaw.id },
    });
  }
}
