import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BookService } from '../../book/book.service';
import { CreateStoryElementDto } from '../story-element/story.element.create.dto';
import { Types } from 'mongoose';
import { Chapter } from '../../chapter/schemas/chapter.schema';

@Injectable()
@ValidatorConstraint({ async: true })
export class SetValidOrderConstraint implements ValidatorConstraintInterface {
  /**This works because the "useContainer" function is being used in the "app.module" file,
   * and the validator that is being referred to is imported as a global provider. */
  constructor(private readonly bookService: BookService) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const { object } = args;
    const { bookId } = object as CreateStoryElementDto;

    if (!Types.ObjectId.isValid(bookId)) {
      return false;
    }

    const book = await this.bookService.findOne({
      filter: { id: bookId },
      include: ['chapters'],
    });

    if (!book) {
      return false;
    }

    let order = value;
    if (order === undefined || order === null) {
      const newOrder = generateUniqueOrder(order);
      order = newOrder;

      while (!isValidateUniqueOrder(order, book.chapters)) {
        const newOrder = generateUniqueOrder(order);
        order = newOrder;
      }
    } else {
      if (!isValidateUniqueOrder(order, book.chapters)) {
        return false;
      }
    }

    // Assign the new value of `order` to the original object
    (object as CreateStoryElementDto).order = order;

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const { object } = args;
    const { bookId, order } = object as CreateStoryElementDto;
    return `Chapter order '${order}' must be unique within the book '${bookId}'`;
  }
}

function generateUniqueOrder(order?: number) {
  return order ? order + 1 : 1;
}

function isValidateUniqueOrder(order: number, chapters: Chapter[]) {
  const chapterWithSameOrder = chapters.find(
    (chapter) => chapter.order === order,
  );

  if (chapterWithSameOrder) {
    return false;
  }

  return true;
}

export function SetValidOrder(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SetValidOrderConstraint,
    });
  };
}
