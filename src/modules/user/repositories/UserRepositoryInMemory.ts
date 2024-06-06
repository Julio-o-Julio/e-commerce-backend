import { User } from '../entities/User';
import { UserRepository } from './UserRepository';

export class UserRepositoryInMemory implements UserRepository {
  public users: User[] = [];

  async create(user: User): Promise<void> {
    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);

    if (!user) return null;

    return user;
  }
  async update(user: User): Promise<void> {
    const userIndex = this.users.findIndex(
      (currentUser) => currentUser.id == user.id,
    );

    if (userIndex >= 0) this.users[userIndex] = user;
  }
  async delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id != id);
  }
}
