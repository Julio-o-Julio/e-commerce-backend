import { UserNotFoundException } from '../../exceptions/userNotFoundException';
import { UserWithoutPermissionException } from '../../exceptions/userWithoutPermissionException';
import { makeUser } from '../../factories/userFactory';
import { UserRepositoryInMemory } from '../../repositories/UserRepositoryInMemory';
import { DeleteUserUseCase } from './deleteUserUseCase';

let userRepositoryInMemory: UserRepositoryInMemory;
let deleteUserUseCase: DeleteUserUseCase;

describe('Delete User', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    deleteUserUseCase = new DeleteUserUseCase(userRepositoryInMemory);
  });

  it('Deve ser capaz de deletar um User', async () => {
    const user = makeUser({});

    userRepositoryInMemory.users = [user];

    await deleteUserUseCase.execute({
      id: user.id,
      email: user.email,
    });

    expect(userRepositoryInMemory.users).toHaveLength(0);
  });

  it('Deve ser capaz de retornar um erro quando User não existir', async () => {
    expect(async () => {
      const user = makeUser({});

      userRepositoryInMemory.users = [user];

      await deleteUserUseCase.execute({
        id: user.id,
        email: 'FakeEmail@gmail.com',
      });
    }).rejects.toThrow(UserNotFoundException);
  });

  it('Deve ser capaz de retornar um erro quando o User não for o responsável pelo User', async () => {
    expect(async () => {
      const user = makeUser({});

      userRepositoryInMemory.users = [user];

      await deleteUserUseCase.execute({
        id: 'FakeUserId',
        email: user.email,
      });
    }).rejects.toThrow(UserWithoutPermissionException);
  });
});
