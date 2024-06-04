import {
  minLength,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { ExceptionsMessage } from '../data/exceptionsMessage';

export function MinLengthCustom(
  min: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'minLengthCustom',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [min],
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return minLength(value, min);
        },
        defaultMessage(validationArguments: ValidationArguments) {
          return ExceptionsMessage.MinLength(validationArguments.property, min);
        },
      },
    });
  };
}
