import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BookService } from '../../book/book.service';
import { ChapterService } from '../../chapter/chapter.service';
import { Types } from 'mongoose';
import { CustomServiceValidateOptions } from '../../request/custom.service.validate';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsValidObjectIdAndExists implements ValidatorConstraintInterface {
  /**This works because the "useContainer" function is being used in the "app.module" file,
   * and the validator that is being referred to is imported as a global provider. */
  constructor(
    private readonly bookService: BookService,
    private readonly chapterService: ChapterService,
  ) {}

  async validate(id: string, args: ValidationArguments) {
    const validateOptions = args.constraints[0] as CustomServiceValidateOptions;

    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    let found = false;
    if (
      validateOptions.service === 'ChapterService' &&
      validateOptions.method === 'findById'
    ) {
      const chapter = await this.chapterService.findById(id);
      found = !!chapter;
    } else if (
      validateOptions.service === 'BookService' &&
      validateOptions.method === 'findById'
    ) {
      const book = await this.bookService.findById(id);
      found = !!book;
    }

    return found;
  }

  defaultMessage(args: ValidationArguments) {
    const { property, value } = args;
    return `${property} is invalid with value ${value}.`;
  }
}
