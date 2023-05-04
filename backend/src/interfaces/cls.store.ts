import { ClsStore } from 'nestjs-cls';
import { Book } from '../book/schemas/book.schema';
import { Chapter } from '../chapter/schemas/chapter.schema';

export interface IZordContext extends ClsStore {
  book: Book;
  chapter: Chapter;
}
