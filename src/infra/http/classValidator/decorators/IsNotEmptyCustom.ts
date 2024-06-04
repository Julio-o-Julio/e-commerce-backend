import {
  isNotEmpty,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { ExceptionsMessage } from '../data/exceptionsMessage';

export function IsNotEmptyCustom(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isNotEmptyCustom',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return isNotEmpty(value);
        },
        defaultMessage(validationArguments: ValidationArguments) {
          return ExceptionsMessage.IsNotEmpty(validationArguments.property);
        },
      },
    });
  };
}
