import { PatchBookDto } from './dto/patch.dto';
import { IBook } from './interfaces/book';

export function updateBookFromDto(dto: PatchBookDto): IBook {
  return {
    id: dto.id,
    title: dto.title,
    summary: dto.summary,
    content: dto.content,
  };
}
