import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ async: false })
export class IsValidObjectId implements ValidatorConstraintInterface {
  async validate(value: string) {
    if (!Types.ObjectId.isValid(value)) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const { property, value } = args;
    return `${property} must be a valid ObjectId and get the value of ${value}`;
  }
}
