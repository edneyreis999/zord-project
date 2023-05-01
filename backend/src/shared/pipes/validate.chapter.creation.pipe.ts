import { Injectable, PipeTransform } from '@nestjs/common';
import { CreateChapterDto } from '../../chapter/dto/create.dto';
import { FetchBookByIdPipe } from './fetch.book.by.id.pipe';
import { ValidateUniqueOrderPipe } from './validate.unique.order.pipe';
import { ValidateUniqueTitlePipe } from './validate.unique.title.pipe';

@Injectable()
export class ValidateChapterCreationPipe implements PipeTransform {
  constructor(
    private readonly fetchBookByIdPipe: FetchBookByIdPipe,
    private readonly fetchUniqueOrderPipe: ValidateUniqueOrderPipe,
    private readonly fetchUniqueTitlePipe: ValidateUniqueTitlePipe,
  ) {}

  async transform(dto: CreateChapterDto) {
    const book = await this.fetchBookByIdPipe.transform(dto.bookId);
    const neighborsOrder = book.chapters.map((c) => c.order);
    const uniqueOrder = this.fetchUniqueOrderPipe.transform({
      neighborsOrder,
      suggestedOrder: dto.order,
    });
    dto.order = uniqueOrder;
    const uniqueTitle = this.fetchUniqueTitlePipe.transform({
      neighborsTitle: book.chapters.map((c) => c.title),
      suggestedTitle: dto.title,
    });
    dto.title = uniqueTitle;

    return dto;
  }
}
