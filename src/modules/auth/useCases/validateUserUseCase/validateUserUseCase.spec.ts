import { ValidateUserUseCase } from './validateUserUseCase';
import { hash } from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { UserRepositoryInMemory } from './../../../../modules/user/repositories/UserRepositoryInMemory';
import { makeUser } from './../../../../modules/user/factories/userFactory';

let validateUserUseCase: ValidateUserUseCase;
let userRepositoryInMemory: UserRepositoryInMemory;

describe('Validação do User', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    validateUserUseCase = new ValidateUserUseCase(userRepositoryInMemory);
  });

  it('Deve ser capaz de retornar um User credenciado quando as credenciais estiverem corretas', async () => {
    const userPasswordWithoutEncryption = 'Teste123';

    const user = makeUser({
      password: await hash(userPasswordWithoutEncryption, 12),
    });

    userRepositoryInMemory.users = [user];

    const result = await validateUserUseCase.execute({
      email: user.email,
      password: userPasswordWithoutEncryption,
    });

    expect(result).toEqual(user);
  });

  it('Deve ser capaz de retornar um erro quando as credenciais estiverem incorretas', async () => {
    const userPasswordWithoutEncryption = 'Teste123';

    const user = makeUser({
      password: await hash(userPasswordWithoutEncryption, 12),
    });

    userRepositoryInMemory.users = [user];

    expect(async () => {
      await validateUserUseCase.execute({
        email: 'incorrect@gmail.com',
        password: userPasswordWithoutEncryption,
      });
    }).rejects.toThrow(UnauthorizedException);

    expect(async () => {
      await validateUserUseCase.execute({
        email: user.email,
        password: 'Incorrect',
      });
    }).rejects.toThrow(UnauthorizedException);
  });
});
