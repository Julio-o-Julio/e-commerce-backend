import { Address } from '../../../../../modules/address/entities/Address';

export class AddressViewModel {
  static toHttp({
    id,
    postalCode,
    houseNumber,
    description,
    createdAt,
  }: Address) {
    return {
      id,
      postalCode,
      houseNumber,
      description,
      createdAt,
    };
  }
}
