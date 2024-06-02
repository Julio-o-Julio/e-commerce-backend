import { AddressRepository } from '../../reposiories/AddressRepository';

interface GetManyAddressRequest {
  userId: string;
  page?: string;
  perPage?: string;
}

export class GetManyAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute({ userId, page, perPage }: GetManyAddressRequest) {
    const DEFAULT_PAGE = 1;
    const DEFAULT_PER_PAGE = 20;

    const currentPage = Number(page) || DEFAULT_PAGE;
    const currentPerPage = Number(perPage) || DEFAULT_PER_PAGE;

    const addresses = await this.addressRepository.findManyByUserId(
      userId,
      currentPage,
      currentPerPage,
    );

    return addresses;
  }
}
