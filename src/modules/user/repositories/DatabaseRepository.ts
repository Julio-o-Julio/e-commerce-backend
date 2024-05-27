import { User } from '../entities/User';
import { UserRepository } from './UserRepository';

export class DatabaseRepository implements UserRepository {
  create(user: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
