import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  NotFoundException,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { BookService } from '../../../book/book.service';
import { CreateChapterWithTextDto } from '../../../chapter/dto/create.dto';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class BookIdValidationInterceptor implements NestInterceptor {
  constructor(
    private readonly bookService: BookService,
    private readonly cls: ClsService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const createChapterDto: CreateChapterWithTextDto = request.body;

    const id = createChapterDto.bookId;
    if (id) {
      const book = await this.bookService.findById(id);
      if (!book) {
        throw new NotFoundException(`Book with id ${id} not found.`);
      }
      // Storing book in request context
      this.cls.set('book', book);
    }

    return next.handle();
  }
}
