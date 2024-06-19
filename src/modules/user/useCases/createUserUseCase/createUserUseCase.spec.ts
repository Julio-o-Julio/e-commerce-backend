import { compare } from 'bcryptjs';
import { UserRepositoryInMemory } from '../../repositories/UserRepositoryInMemory';
import { CreateUserUseCase } from './createUserUseCase';
import { makeUser } from '../../factories/userFactory';
import { UserWithSameEmailException } from '../../exceptions/userWithSameEmailException';

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: UserRepositoryInMemory;

describe('Create User', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });

  it('Deve ser capaz de criar um User', async () => {
    expect(userRepositoryInMemory.users).toHaveLength(0);

    const user = await createUserUseCase.execute(makeUser({}));

    expect(userRepositoryInMemory.users).toEqual([user]);
  });

  it('Deve ser capaz de criar um User com a senha encriptografada', async () => {
    const userPasswordWithoutEncryption = 'Teste123';

    const user = await createUserUseCase.execute(
      makeUser({
        password: userPasswordWithoutEncryption,
      }),
    );

    const userHasPasswordEncrypted = await compare(
      userPasswordWithoutEncryption,
      user.password,
    );

    expect(userHasPasswordEncrypted).toBeTruthy();
  });

  it('Deve ser capaz de retornar um erro quando o email já existe', async () => {
    const user = makeUser({});

    userRepositoryInMemory.users = [user];

    expect(
      async () => await createUserUseCase.execute(makeUser({})),
    ).rejects.toThrow(UserWithSameEmailException);
  });
});
