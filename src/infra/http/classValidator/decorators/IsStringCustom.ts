import {
  isString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { ExceptionsMessage } from '../data/exceptionsMessage';

export function IsStringCustom(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isStringCustom',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return isString(value);
        },
        defaultMessage(validationArguments: ValidationArguments) {
          return ExceptionsMessage.IsString(validationArguments.property);
        },
      },
    });
  };
}
