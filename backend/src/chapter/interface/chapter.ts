import { Book } from '../../book/schemas/book.schema';

export interface IChapter {
  id?: string;
  title: string;
  slug?: string;
  book?: Book;
  summary: string;
  content: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
