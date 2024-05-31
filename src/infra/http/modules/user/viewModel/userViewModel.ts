import { User } from './../../../../../modules/user/entities/User';

export class UserViewModel {
  static toHttp({ id, name, email, createdAt }: User) {
    return {
      id,
      name,
      email,
      createdAt,
    };
  }
}
