import { ClsStore } from 'nestjs-cls';
import { Book } from '../book/schemas/book.schema';
import { Chapter } from '../chapter/schemas/chapter.schema';

export interface IContext extends ClsStore {
  book: Book;
  chapter: Chapter;
}
