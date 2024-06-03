import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserRepository } from './../../modules/user/repositories/UserRepository';
import { PrismaUserRepository } from './prisma/repositories/PrismaUserRepository';
import { AddressRepository } from '../../modules/address/reposiories/AddressRepository';
import { PrismaAddressRepository } from './prisma/repositories/PrismaAddressRepository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: AddressRepository,
      useClass: PrismaAddressRepository,
    },
  ],
  exports: [UserRepository, AddressRepository],
})
export class DatabaseModule {}
