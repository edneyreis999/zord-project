// custom-service-validate.decorator.ts

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';

type ValidatorConstraintConstructor<T = any> = new (
  ...args: any[]
) => ValidatorConstraintInterface & T;

export interface CustomServiceValidateOptions {
  service: 'BookService' | 'ChapterService';
  method: 'findById';
}

export function CustomServiceValidate(
  constraint: ValidatorConstraintConstructor,
  additionalOptions: CustomServiceValidateOptions,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol): void {
    registerDecorator({
      name: 'CustomServiceValidate',
      target: object.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      constraints: [additionalOptions],
      validator: constraint,
    });
  };
}
