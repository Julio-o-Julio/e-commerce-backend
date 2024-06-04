import {
  isInt,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { ExceptionsMessage } from '../data/exceptionsMessage';

export function IsIntCustom(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isIntCustom',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: number) {
          return isInt(value);
        },
        defaultMessage(validationArguments: ValidationArguments) {
          return ExceptionsMessage.IsInt(validationArguments.property);
        },
      },
    });
  };
}
