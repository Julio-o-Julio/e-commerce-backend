import { makeUser } from '../../../user/factories/userFactory';
import { makeAddress } from '../../factories/addressFactory';
import { AddressRepositoryInMemory } from '../../reposiories/AddressRepositoryInMemory';
import { UpdateAddressUseCase } from './updateAddressUseCase';
import { AddressNotFoundException } from '../../exceptions/addressNotFoundException';
import { AddressWithoutPermissionException } from '../../exceptions/addressWithoutPermissionException';

let addressRepositoryInMemory: AddressRepositoryInMemory;
let updateAddressUseCase: UpdateAddressUseCase;

describe('Update Address', () => {
  beforeEach(() => {
    addressRepositoryInMemory = new AddressRepositoryInMemory();
    updateAddressUseCase = new UpdateAddressUseCase(addressRepositoryInMemory);
  });

  it('Deve ser capaz de atualizar um Address', async () => {
    const user = makeUser({});
    const address = makeAddress({ userId: user.id });

    addressRepositoryInMemory.addresses = [address];

    const postalCodeChanged = '22222-222';
    const houseNumberChanged = 99;
    const descriptionChanged = 'Apto 99';

    await updateAddressUseCase.execute({
      addressId: address.id,
      postalCode: postalCodeChanged,
      houseNumber: houseNumberChanged,
      description: descriptionChanged,
      userId: user.id,
    });

    expect(addressRepositoryInMemory.addresses[0].postalCode).toEqual(
      postalCodeChanged,
    );
    expect(addressRepositoryInMemory.addresses[0].houseNumber).toEqual(
      houseNumberChanged,
    );
    expect(addressRepositoryInMemory.addresses[0].description).toEqual(
      descriptionChanged,
    );
  });

  it('Deve ser capaz de retornar um erro quando Address não existir', async () => {
    expect(async () => {
      const user = makeUser({});
      const address = makeAddress({ userId: user.id });

      addressRepositoryInMemory.addresses = [address];

      await updateAddressUseCase.execute({
        addressId: 'fakeAddressId',
        postalCode: '22222-222',
        houseNumber: 99,
        description: 'Apto 99',
        userId: user.id,
      });
    }).rejects.toThrow(AddressNotFoundException);
  });

  it('Deve ser capaz de retornar um erro quando o User não for o responsável pelo endereço', async () => {
    expect(async () => {
      const user = makeUser({});
      const address = makeAddress({ userId: user.id });

      addressRepositoryInMemory.addresses = [address];

      await updateAddressUseCase.execute({
        addressId: address.id,
        postalCode: '22222-222',
        houseNumber: 99,
        description: 'Apto 99',
        userId: 'fakeUserId',
      });
    }).rejects.toThrow(AddressWithoutPermissionException);
  });
});
