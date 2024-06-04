import {
  isEmail,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { ExceptionsMessage } from '../data/exceptionsMessage';

export function IsEmailCustom(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isEmailCustom',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return isEmail(value);
        },
        defaultMessage(validationArguments: ValidationArguments) {
          return ExceptionsMessage.IsEmail(validationArguments.property);
        },
      },
    });
  };
}
