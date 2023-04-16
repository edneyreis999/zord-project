import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './schemas/book.schema';
import { StoryElementCrudService } from '../shared/story-element/story.element.crud.service';
import { Chapter } from '../chapter/schemas/chapter.schema';

/**
 * The BookService class is responsible for managing CRUD operations related to books.
 * This class extends the StoryElementCrudService class, which contains generic CRUD operations logic for story elements.
 */
@Injectable()
export class BookService extends StoryElementCrudService<Book> {
  protected availableFieldsToInclude = ['chapters'];

  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {
    super(bookModel);
  }
}
