import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { makeUser } from '../../../user/factories/userFactory';
import { makeAddress } from '../../factories/addressFactory';
import { AddressRepositoryInMemory } from '../../reposiories/AddressRepositoryInMemory';
import { GetAddressUseCase } from './getAddressUseCase';

let addressRepositoryInMemory: AddressRepositoryInMemory;
let getAddressUseCase: GetAddressUseCase;

describe('Get Address', () => {
  beforeEach(() => {
    addressRepositoryInMemory = new AddressRepositoryInMemory();
    getAddressUseCase = new GetAddressUseCase(addressRepositoryInMemory);
  });

  it('Deve ser capaz de retornar um Address', async () => {
    const user = makeUser({});
    const address = makeAddress({ userId: user.id });

    addressRepositoryInMemory.addresses = [address];

    const result = await getAddressUseCase.execute({
      addressId: address.id,
      userId: user.id,
    });

    expect(result).toEqual(address);
  });

  it('Deve ser capaz de retornar um erro quando Address não existir', async () => {
    expect(async () => {
      const user = makeUser({});
      const address = makeAddress({ userId: user.id });

      addressRepositoryInMemory.addresses = [address];

      await getAddressUseCase.execute({
        addressId: 'fakeAddressId',
        userId: user.id,
      });
    }).rejects.toThrow(NotFoundException);
  });

  it('Deve ser capaz de retornar um erro quando o User não for o responsável pelo endereço', async () => {
    expect(async () => {
      const user = makeUser({});
      const address = makeAddress({ userId: user.id });

      addressRepositoryInMemory.addresses = [address];

      await getAddressUseCase.execute({
        addressId: address.id,
        userId: 'fakeUserId',
      });
    }).rejects.toThrow(UnauthorizedException);
  });
});
