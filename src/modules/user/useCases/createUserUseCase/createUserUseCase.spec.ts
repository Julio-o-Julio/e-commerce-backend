import { compare } from 'bcrypt';
import { UserRepositoryInMemory } from '../../repositories/UserRepositoryInMemory';
import { CreateUserUseCase } from './createUserUseCase';

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: UserRepositoryInMemory;

describe('Create User', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });

  it('Deve ser capaz de criar um User', async () => {
    expect(userRepositoryInMemory.users).toEqual([]);

    const user = await createUserUseCase.execute({
      name: 'Teste',
      email: 'teste@gmail.com',
      password: 'Teste123',
    });

    expect(userRepositoryInMemory.users).toEqual([user]);
  });

  it('Deve ser capaz de criar um User com a senha encriptografada', async () => {
    const userPasswordWithoutEncryption = 'Teste123';

    const user = await createUserUseCase.execute({
      name: 'Teste',
      email: 'teste@gmail.com',
      password: userPasswordWithoutEncryption,
    });

    const userHasPasswordEncrypted = await compare(
      userPasswordWithoutEncryption,
      user.password,
    );

    expect(userHasPasswordEncrypted).toBeTruthy();
  });
});
