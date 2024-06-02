import { randomUUID } from 'crypto';
import { Replace } from '../../../utils/replace';

interface AddressProps {
  postalCode: string;
  houseNumber: number;
  description: string | null;
  createdAt: Date;
  userId: string;
}

export class Address {
  private props: AddressProps;
  private _id: string;

  constructor(
    props: Replace<AddressProps, { description?: string; createdAt?: Date }>,
    id?: string,
  ) {
    this.props = {
      ...props,
      description: props.description ?? null,
      createdAt: props.createdAt ?? new Date(),
    };

    this._id = id || randomUUID();
  }

  get id(): string {
    return this._id;
  }
  get postalCode(): string {
    return this.props.postalCode;
  }
  set postalCode(postalCode: string) {
    this.props.postalCode = postalCode;
  }
  get houseNumber(): number {
    return this.props.houseNumber;
  }
  set houseNumber(houseNumber: number) {
    this.props.houseNumber = houseNumber;
  }
  get description(): string | null {
    return this.props.description;
  }
  set description(description: string | null) {
    this.props.description = description;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get userId(): string {
    return this.props.userId;
  }
}
