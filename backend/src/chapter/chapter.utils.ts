import { Book } from '../book/schemas/book.schema';
import { CreateChapterDto } from './dto/create.dto';
import { PatchChapterDto } from './dto/patch.dto';
import { IChapter } from './interface/Chapter';

export function createChapterFromDto(
  dto: CreateChapterDto,
  book: Book,
): IChapter {
  return {
    book: book,
    title: dto.title,
    summary: dto.summary,
    content: dto.content,
    order: dto.order,
  };
}

export function updateChapterFromDto(dto: PatchChapterDto): IChapter {
  return {
    id: dto.id,
    title: dto.title,
    summary: dto.summary,
    content: dto.content,
    order: dto.order,
  };
}
