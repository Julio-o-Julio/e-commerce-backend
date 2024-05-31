import { randomUUID } from 'crypto';
import { Replace } from './../../../utils/replace';

interface UserSchema {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export class User {
  private props: UserSchema;
  private _id: string;

  constructor(props: Replace<UserSchema, { createdAt?: Date }>, id?: string) {
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
    };
    this._id = id || randomUUID();
  }

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this.props.name;
  }
  set name(name: string) {
    this.props.name = name;
  }
  get email(): string {
    return this.props.email;
  }
  set email(email: string) {
    this.props.email = email;
  }
  get password(): string {
    return this.props.password;
  }
  set password(password: string) {
    this.props.password = password;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
}
