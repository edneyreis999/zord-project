import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { BookService } from '../../book/book.service';
import { IContext } from '../../interfaces/cls.store';

@Injectable()
export class FetchBookByIdPipe implements PipeTransform {
  constructor(
    private readonly bookService: BookService,
    private readonly cls: ClsService<IContext>,
  ) {}

  async transform(bookId: string) {
    const contextBook = this.cls.get('book');
    if (contextBook && contextBook._id.toString() === bookId) {
      return contextBook;
    }
    const book = await this.bookService.findById(bookId, ['chapters']);
    if (!book) {
      throw new NotFoundException(`Book with id ${bookId} not found.`);
    }

    this.cls.set('book', book);
    return book;
  }
}
