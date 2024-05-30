import { User } from '../entities/User';

type Override = Partial<User>;

export const makeUser = ({ id, ...override }: Override) => {
  return new User(
    {
      name: 'Teste',
      email: 'teste@gmail.com',
      password: 'Teste123',
      ...override,
    },
    id,
  );
};
