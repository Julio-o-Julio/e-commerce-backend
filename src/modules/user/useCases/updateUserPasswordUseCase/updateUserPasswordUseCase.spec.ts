import { compare, hash } from 'bcryptjs';
import { UserNotFoundException } from '../../exceptions/userNotFoundException';
import { UserWithoutPermissionException } from '../../exceptions/userWithoutPermissionException';
import { makeUser } from '../../factories/userFactory';
import { UserRepositoryInMemory } from '../../repositories/UserRepositoryInMemory';
import { UpdateUserPasswordUseCase } from './updateUserPasswordUseCase';

let userRepositoryInMemory: UserRepositoryInMemory;
let updateUserPasswordUseCase: UpdateUserPasswordUseCase;

describe('Update User Password', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    updateUserPasswordUseCase = new UpdateUserPasswordUseCase(
      userRepositoryInMemory,
    );
  });

  it('Deve ser capaz de atualizar o campo password de um User', async () => {
    const user = makeUser({});

    userRepositoryInMemory.users = [user];

    const oldPassword = user.password;

    await updateUserPasswordUseCase.execute({
      id: user.id,
      email: user.email,
      password: await hash('FakePassword', 12),
    });

    const userHasPasswordEncrypted = await compare(oldPassword, user.password);

    expect(userHasPasswordEncrypted).toBeFalsy();
  });

  it('Deve ser capaz de retornar um erro quando User não existir', async () => {
    expect(async () => {
      const user = makeUser({});

      userRepositoryInMemory.users = [user];

      await updateUserPasswordUseCase.execute({
        id: user.id,
        email: 'FakeUserEmail@gmail.com',
        password: await hash('FakePassword', 12),
      });
    }).rejects.toThrow(UserNotFoundException);
  });

  it('Deve ser capaz de retornar um erro quando o User não for o responsável pelo User', async () => {
    expect(async () => {
      const user = makeUser({});

      userRepositoryInMemory.users = [user];

      await updateUserPasswordUseCase.execute({
        id: 'FakeUserId',
        email: user.email,
        password: await hash('FakePassword', 12),
      });
    }).rejects.toThrow(UserWithoutPermissionException);
  });
});
