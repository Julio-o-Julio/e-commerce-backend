import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { DatabaseModule } from '../../../database/database.module';
import { CreateAddressUseCase } from '../../../../modules/address/useCase/createAddressUseCase/createAddressUseCase';
import { GetAddressUseCase } from '../../../../modules/address/useCase/getAddressUseCase/getAddressUseCase';
import { GetManyAddressUseCase } from '../../../../modules/address/useCase/getManyAddressUseCase/getManyAddressUseCase';
import { UpdateAddressUseCase } from '../../../../modules/address/useCase/updateAddressUseCase/updateAddressUseCase';
import { DeleteAddressUseCase } from '../../../../modules/address/useCase/deleteAddressUseCase/deleteAddressUseCase';

@Module({
  imports: [DatabaseModule],
  controllers: [AddressController],
  providers: [
    CreateAddressUseCase,
    GetAddressUseCase,
    GetManyAddressUseCase,
    UpdateAddressUseCase,
    DeleteAddressUseCase,
  ],
})
export class AddressModule {}
