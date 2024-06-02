import { makeAddress } from '../../factories/addressFactory';
import { AddressRepositoryInMemory } from '../../reposiories/AddressRepositoryInMemory';
import { CreateAddressUseCase } from './createAddressUseCase';

let addressRepositoryInMemory: AddressRepositoryInMemory;
let createAddressUseCase: CreateAddressUseCase;

describe('Create Address', () => {
  beforeEach(() => {
    addressRepositoryInMemory = new AddressRepositoryInMemory();
    createAddressUseCase = new CreateAddressUseCase(addressRepositoryInMemory);
  });

  it('Deve ser capaz de criar um Address', async () => {
    expect(addressRepositoryInMemory.addresses).toHaveLength(0);

    const address = await createAddressUseCase.execute(makeAddress({}));

    expect(addressRepositoryInMemory.addresses).toEqual([address]);
  });
});
