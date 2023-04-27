import { ApiProperty } from '@nestjs/swagger';
import { Chapter } from '../schemas/chapter.schema';
import { Book } from '../../book/schemas/book.schema';

export class ResponseChapterDto {
  static fromChapter(chapter: Chapter): ResponseChapterDto {
    return {
      id: chapter._id.toString(),
      title: chapter.title,
      slug: chapter.slug,
      book: chapter.book as Book | string,
      arcs: chapter?.arcs?.map((arc) => arc.name),
      content: chapter.content,
      order: chapter.order,
      summary: chapter.summary,
      createdAt: chapter?.createdAt?.toISOString(),
      updatedAt: chapter?.updatedAt?.toISOString(),
    };
  }

  static fromManyChapters(books: Chapter[]): ResponseChapterDto[] {
    return books.map(ResponseChapterDto.fromChapter);
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
  readonly title: string;

  @ApiProperty({
    type: String,
    description: 'slug of the chapter',
    example: 'ghork',
  })
  readonly slug: string;

  @ApiProperty({
    type: Book,
    description: 'Book of the chapter',
    example: "Ghork's story",
  })
  readonly book: Book | string;

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'List of arcs of this chapter',
    example: ['O plano de Lala', 'Prova de Fogo'],
  })
  readonly arcs: string[];

  @ApiProperty({
    type: String,
    description: 'Content of the chapter',
    example: 'lorem ipsum dolor sit amet',
  })
  readonly content: string;

  @ApiProperty({
    type: String,
    description: 'order of the chapter',
    example: '1',
  })
  readonly order: number;

  @ApiProperty({
    type: String,
    description: 'Summary of the chapter',
    example: 'lorem ipsum dolor sit amet',
  })
  readonly summary: string;

  @ApiProperty({
    type: String,
    description: 'Date of the creation of the chapter',
    example: '2022-11-16T19:10:48.059Z',
  })
  readonly createdAt: string;

  @ApiProperty({
    type: String,
    description: 'Date of the last update of the chapter',
    example: '2022-11-16T19:10:48.059Z',
  })
  readonly updatedAt: string;
}
