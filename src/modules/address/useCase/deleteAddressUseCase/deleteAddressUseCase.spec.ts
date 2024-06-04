import { makeUser } from '../../../user/factories/userFactory';
import { makeAddress } from '../../factories/addressFactory';
import { AddressRepositoryInMemory } from '../../reposiories/AddressRepositoryInMemory';
import { DeleteAddressUseCase } from './deleteAddressUseCase';
import { AddressNotFoundException } from '../../exceptions/AddressNotFoundException';
import { AddressWithoutPermissionException } from '../../exceptions/AddressWithoutPermissionException';

let addressRepositoryInMemory: AddressRepositoryInMemory;
let deleteAddressUseCase: DeleteAddressUseCase;

describe('Delete Address', () => {
  beforeEach(() => {
    addressRepositoryInMemory = new AddressRepositoryInMemory();
    deleteAddressUseCase = new DeleteAddressUseCase(addressRepositoryInMemory);
  });

  it('Deve ser capaz de deletar um Address', async () => {
    const user = makeUser({});
    const address = makeAddress({ userId: user.id });

    addressRepositoryInMemory.addresses = [address];

    await deleteAddressUseCase.execute({
      addressId: address.id,
      userId: user.id,
    });

    expect(addressRepositoryInMemory.addresses).toHaveLength(0);
  });

  it('Deve ser capaz de retornar um erro quando Address não existir', async () => {
    expect(async () => {
      const user = makeUser({});
      const address = makeAddress({ userId: user.id });

      addressRepositoryInMemory.addresses = [address];

      await deleteAddressUseCase.execute({
        addressId: 'fakeAddressId',
        userId: user.id,
      });
    }).rejects.toThrow(AddressNotFoundException);
  });

  it('Deve ser capaz de retornar um erro quando o User não for o responsável pelo endereço', async () => {
    expect(async () => {
      const user = makeUser({});
      const address = makeAddress({ userId: user.id });

      addressRepositoryInMemory.addresses = [address];

      await deleteAddressUseCase.execute({
        addressId: address.id,
        userId: 'fakeUserId',
      });
    }).rejects.toThrow(AddressWithoutPermissionException);
  });
});
