import { makeUser } from '../../../user/factories/userFactory';
import { Address } from '../../entities/Address';
import { makeAddress } from '../../factories/addressFactory';
import { AddressRepositoryInMemory } from '../../reposiories/AddressRepositoryInMemory';
import { GetManyAddressUseCase } from './getManyAddressUseCase';

let addressRepositoryInMemory: AddressRepositoryInMemory;
let getManyAddressUseCase: GetManyAddressUseCase;

describe('Get many Address', () => {
  beforeEach(() => {
    addressRepositoryInMemory = new AddressRepositoryInMemory();
    getManyAddressUseCase = new GetManyAddressUseCase(
      addressRepositoryInMemory,
    );
  });

  it('Deve ser capaz de retornar todos os Address de um User', async () => {
    const user = makeUser({});
    const addresses = [...new Array(8)].map(() =>
      makeAddress({ userId: user.id }),
    );

    addressRepositoryInMemory.addresses = addresses;

    const result = await getManyAddressUseCase.execute({
      userId: user.id,
    });

    expect(result).toEqual(addresses);
  });

  it('Deve ser capaz de retornar todos os Address pertencentes ao User e somente do User', async () => {
    const user1 = makeUser({});
    const user2 = makeUser({});
    const addresses = [...new Array(8)].map((_, index) =>
      makeAddress({ userId: index < 4 ? user1.id : user2.id }),
    );

    addressRepositoryInMemory.addresses = addresses;

    const result = await getManyAddressUseCase.execute({
      userId: user1.id,
    });

    expect(result).toHaveLength(4);
  });

  it('Deve ser capaz de retornar a quantidade de Address referente ao tamanho da página', async () => {
    const user = makeUser({});
    const addresses = [...new Array(8)].map(() =>
      makeAddress({ userId: user.id }),
    );

    addressRepositoryInMemory.addresses = addresses;

    const result = await getManyAddressUseCase.execute({
      userId: user.id,
      perPage: '2',
    });

    expect(result).toHaveLength(2);
  });

  it('Deve ser capaz de retornar os Address de uma página específica', async () => {
    const user = makeUser({});
    const addresses = [...new Array(8)].map((_, index) =>
      makeAddress({
        userId: user.id,
        description: index < 4 ? 'page 1' : 'page 2',
      }),
    );

    addressRepositoryInMemory.addresses = addresses;

    let result: Address[];

    result = await getManyAddressUseCase.execute({
      userId: user.id,
      perPage: '4',
      page: '2',
    });

    expect(result[0].description).toEqual('page 2');

    result = await getManyAddressUseCase.execute({
      userId: user.id,
      perPage: '4',
      page: '1',
    });

    expect(result[0].description).toEqual('page 1');
  });
});
