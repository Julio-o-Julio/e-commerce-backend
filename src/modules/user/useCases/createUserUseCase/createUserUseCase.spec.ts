import { compare } from 'bcrypt';
import { UserRepositoryInMemory } from '../../repositories/UserRepositoryInMemory';
import { CreateUserUseCase } from './createUserUseCase';
import { makeUser } from '../../factories/userFactory';

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: UserRepositoryInMemory;

describe('Create User', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });

  it('Deve ser capaz de criar um User', async () => {
    expect(userRepositoryInMemory.users).toEqual([]);

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
});
