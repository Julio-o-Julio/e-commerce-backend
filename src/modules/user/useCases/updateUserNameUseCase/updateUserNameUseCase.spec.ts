import { UserNotFoundException } from '../../exceptions/userNotFoundException';
import { UserWithoutPermissionException } from '../../exceptions/userWithoutPermissionException';
import { makeUser } from '../../factories/userFactory';
import { UserRepositoryInMemory } from '../../repositories/UserRepositoryInMemory';
import { UpdateUserNameUseCase } from './updateUserNameUseCase';

let userRepositoryInMemory: UserRepositoryInMemory;
let updateUserNameUseCase: UpdateUserNameUseCase;

describe('Update User Name', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    updateUserNameUseCase = new UpdateUserNameUseCase(userRepositoryInMemory);
  });

  it('Deve ser capaz de atualizar o campo name de um User', async () => {
    const user = makeUser({});

    userRepositoryInMemory.users = [user];

    const nameChanged = 'Nome Alterado';

    await updateUserNameUseCase.execute({
      id: user.id,
      name: nameChanged,
      email: user.email,
    });

    expect(userRepositoryInMemory.users[0].name).toEqual(nameChanged);
  });

  it('Deve ser capaz de retornar um erro quando User não existir', async () => {
    expect(async () => {
      const user = makeUser({});

      userRepositoryInMemory.users = [user];

      await updateUserNameUseCase.execute({
        id: user.id,
        name: 'Nome Alterado',
        email: 'FakeUserEmail',
      });
    }).rejects.toThrow(UserNotFoundException);
  });

  it('Deve ser capaz de retornar um erro quando o User não for o responsável pelo User', async () => {
    expect(async () => {
      const user = makeUser({});

      userRepositoryInMemory.users = [user];

      await updateUserNameUseCase.execute({
        id: 'FakeUserId',
        name: 'Nome Alterado',
        email: user.email,
      });
    }).rejects.toThrow(UserWithoutPermissionException);
  });
});
