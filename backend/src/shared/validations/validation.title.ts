import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BookService } from '../../book/book.service';
import { CreateStoryElementDto } from '../story-element/story.element.create.dto';
import { Types } from 'mongoose';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueTitle implements ValidatorConstraintInterface {
  /**This works because the "useContainer" function is being used in the "app.module" file,
   * and the validator that is being referred to is imported as a global provider. */
  constructor(private readonly bookService: BookService) {}

  async validate(value: any, args: ValidationArguments) {
    const { object } = args;
    const { bookId, title } = object as CreateStoryElementDto;

    if (!title) {
      return true;
    }

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

    const chapterWithSameTitle = book.chapters.find(
      (chapter) => chapter.title === title,
    );

    if (chapterWithSameTitle) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const { object } = args;
    const { bookId, title } = object as CreateStoryElementDto;
    return `Chapter title '${title}'' must be unique within the book '${bookId}'`;
  }
}
