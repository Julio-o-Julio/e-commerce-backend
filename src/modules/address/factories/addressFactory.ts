import { Address } from '../entities/Address';

type Override = Partial<Address>;

export const makeAddress = ({ id, ...override }: Override) => {
  return new Address(
    {
      postalCode: '99999-999',
      houseNumber: 22,
      description: 'Apto 22',
      userId: '@qualquerUser',
      ...override,
    },
    id,
  );
};
