import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { CreateAddressUseCase } from '../../../../modules/address/useCase/createAddressUseCase/createAddressUseCase';
import { UpdateAddressUseCase } from '../../../../modules/address/useCase/updateAddressUseCase/updateAddressUseCase';
import { DeleteAddressUseCase } from '../../../../modules/address/useCase/deleteAddressUseCase/deleteAddressUseCase';
import { GetAddressUseCase } from '../../../../modules/address/useCase/getAddressUseCase/getAddressUseCase';
import { GetManyAddressUseCase } from '../../../../modules/address/useCase/getManyAddressUseCase/getManyAddressUseCase';
import { AuthenticatedRequestModel } from '../auth/models/authenticatedRequestModel';
import { CreateAddressBody } from './dtos/createAddressBody';
import { AddressViewModel } from './viewModel/addressViewModel';
import { UpdateAddressBody } from './dtos/updateAddressBody';

@Controller('addresses')
export class AddressController {
  constructor(
    private createAddressUseCase: CreateAddressUseCase,
    private getAddressUseCase: GetAddressUseCase,
    private getManyAddressUseCase: GetManyAddressUseCase,
    private updateAddressUseCase: UpdateAddressUseCase,
    private deleteAddressUseCase: DeleteAddressUseCase,
  ) {}

  @Post()
  async createAddress(
    @Request() request: AuthenticatedRequestModel,
    @Body() body: CreateAddressBody,
  ) {
    const { postalCode, houseNumber, description } = body;

    const address = await this.createAddressUseCase.execute({
      postalCode,
      houseNumber,
      description,
      userId: request.user.id,
    });

    return AddressViewModel.toHttp(address);
  }

  @Get(':id')
  async getAddress(
    @Request() request: AuthenticatedRequestModel,
    @Param('id') addressId: string,
  ) {
    const address = await this.getAddressUseCase.execute({
      addressId,
      userId: request.user.id,
    });

    return AddressViewModel.toHttp(address);
  }

  @Get()
  async getManyAddress(
    @Request() request: AuthenticatedRequestModel,
    @Query('page') page: string,
    @Query('perPage') perPage: string,
  ) {
    const addresses = await this.getManyAddressUseCase.execute({
      userId: request.user.id,
      page,
      perPage,
    });

    return addresses.map(AddressViewModel.toHttp);
  }

  @Put(':id')
  async updateAddress(
    @Request() request: AuthenticatedRequestModel,
    @Body() body: UpdateAddressBody,
    @Param('id') addressId: string,
  ) {
    const { postalCode, houseNumber, description } = body;

    const address = await this.updateAddressUseCase.execute({
      addressId,
      postalCode,
      houseNumber,
      description,
      userId: request.user.id,
    });

    return AddressViewModel.toHttp(address);
  }

  @Delete(':id')
  async deleteAddress(
    @Request() request: AuthenticatedRequestModel,
    @Param('id') addressId: string,
  ) {
    await this.deleteAddressUseCase.execute({
      addressId,
      userId: request.user.id,
    });
  }
}
