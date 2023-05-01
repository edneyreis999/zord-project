import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ResponseBookDto } from '../../book/dto/response.dto';
import { Book } from '../../book/schemas/book.schema';
import { Chapter } from '../schemas/chapter.schema';

export class ResponseChapterDto {
  static fromChapter(chapter: Chapter | Types.ObjectId): ResponseChapterDto {
    if (chapter instanceof Types.ObjectId) {
      return {
        id: chapter.toString(),
      };
    } else {
      return {
        id: chapter._id.toString(),
        title: chapter.title,
        slug: chapter.slug,
        book: ResponseBookDto.fromBook(chapter.book),
        arcs: chapter?.arcs?.map((arc) => arc.name ?? arc.toString()),
        content: chapter.content,
        order: chapter.order,
        summary: chapter.summary,
        createdAt: chapter?.createdAt?.toISOString(),
        updatedAt: chapter?.updatedAt?.toISOString(),
      };
    }
  }

  static fromManyChapters(chapters: Chapter[]): ResponseChapterDto[] {
    return chapters.map(ResponseChapterDto.fromChapter);
  }

  @ApiProperty({
    type: String,
    description: 'id of the book',
    example: '896e54c2-65e2-11ed-9022-0242ac120002',
  })
  readonly id: string;

  @ApiProperty({
    type: String,
    description: 'Chapter Name',
    example: 'chapter 1',
  })
  readonly title?: string;

  @ApiProperty({
    type: String,
    description: 'slug of the chapter',
    example: 'ghork',
  })
  readonly slug?: string;

  @ApiProperty({
    type: Book,
    description: 'Book of the chapter',
    example: "Ghork's story",
  })
  readonly book?: ResponseBookDto | string;

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'List of arcs of this chapter',
    example: ['O plano de Lala', 'Prova de Fogo'],
  })
  readonly arcs?: string[];

  @ApiProperty({
    type: String,
    description: 'Content of the chapter',
    example: 'lorem ipsum dolor sit amet',
  })
  readonly content?: string;

  @ApiProperty({
    type: String,
    description: 'order of the chapter',
    example: '1',
  })
  readonly order?: number;

  @ApiProperty({
    type: String,
    description: 'Summary of the chapter',
    example: 'lorem ipsum dolor sit amet',
  })
  readonly summary?: string;

  @ApiProperty({
    type: String,
    description: 'Date of the creation of the chapter',
    example: '2022-11-16T19:10:48.059Z',
  })
  readonly createdAt?: string;

  @ApiProperty({
    type: String,
    description: 'Date of the last update of the chapter',
    example: '2022-11-16T19:10:48.059Z',
  })
  readonly updatedAt?: string;
}
