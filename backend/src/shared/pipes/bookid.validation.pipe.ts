import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common';
import { BookService } from '../../book/book.service';
import { CreateChapterWithTextDto } from '../../chapter/dto/create.dto';

@Injectable()
export class BookIdValidationPipe implements PipeTransform {
  constructor(private readonly bookService: BookService) {}

  async transform(value: CreateChapterWithTextDto) {
    const id = value.bookId;

    if (id) {
      const book = await this.bookService.findById(id);
      if (!book) {
        throw new NotFoundException(`Book with id ${id} not found.`);
      }
      value.book = book; // Adicione o objeto book ao valor retornado
    }

    return value;
  }
}
