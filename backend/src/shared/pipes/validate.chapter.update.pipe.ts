import { Injectable, PipeTransform } from '@nestjs/common';
import { PatchChapterDto } from '../../chapter/dto/patch.dto';
import { FetchBookByIdPipe } from './fetch.book.by.id.pipe';
import { FetchChapterByIdPipe } from './fetch.chapter.by.id.pipe';
import { ValidateUniqueOrderPipe } from './validate.unique.order.pipe';
import { ValidateUniqueTitlePipe } from './validate.unique.title.pipe';

@Injectable()
export class ValidateChapterUpdatePipe implements PipeTransform {
  constructor(
    private readonly fetchBookByIdPipe: FetchBookByIdPipe,
    private readonly fetchChapterByIdPipe: FetchChapterByIdPipe,
    private readonly fetchUniqueOrderPipe: ValidateUniqueOrderPipe,
    private readonly fetchUniqueTitlePipe: ValidateUniqueTitlePipe,
  ) {}

  async transform(dto: PatchChapterDto) {
    const chapter = await this.fetchChapterByIdPipe.transform(dto.id);
    const book = await this.fetchBookByIdPipe.transform(
      chapter.book._id.toString(),
    );
    const neighborsOrder = book.chapters
      .map((c) => c.order)
      .filter((order) => order !== chapter.order);
    const uniqueOrder = this.fetchUniqueOrderPipe.transform({
      neighborsOrder,
      suggestedOrder: dto.order ?? chapter.order,
    });
    dto.order = uniqueOrder;
    const uniqueTitle = this.fetchUniqueTitlePipe.transform({
      neighborsTitle: book.chapters
        .map((c) => c.title)
        .filter((title) => title !== chapter.title),
      suggestedTitle: dto.title ?? chapter.title,
    });
    dto.title = uniqueTitle;

    return dto;
  }
}
