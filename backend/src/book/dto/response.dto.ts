import { ApiProperty } from '@nestjs/swagger';
import { CreateBookDto } from './create.dto';
import { Chapter } from '../../chapter/schemas/chapter.schema';
import { Book } from '../schemas/book.schema';

export class ResponseBookDto extends CreateBookDto {
  static fromBook(book: Book): ResponseBookDto {
    return {
      id: book._id.toString(),
      name: book.name,
      slug: book.slug,
      chapters: book.chapters,
      createdAt: book.createdAt.toISOString(),
      updatedAt: book.updatedAt.toISOString(),
    };
  }

  static fromManyBooks(books: Book[]): ResponseBookDto[] {
    return books.map(ResponseBookDto.fromBook);
  }

  @ApiProperty({
    type: String,
    description: 'id of the book',
    example: '896e54c2-65e2-11ed-9022-0242ac120002',
  })
  readonly id: string;

  @ApiProperty({
    type: String,
    description: 'slug of the book',
    example: 'ghork',
  })
  readonly slug: string;

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'List of chapters of this book',
    example: ['Chapter 1', 'Chapter 2'],
  })
  readonly chapters: Chapter[];

  @ApiProperty({
    type: String,
    description: 'Date of created the book',
    example: '2022-11-16T19:10:48.059Z',
  })
  readonly createdAt: string;

  @ApiProperty({
    type: String,
    description: 'Date of updated the book',
    example: '2022-11-16T19:10:48.059Z',
  })
  readonly updatedAt: string;
}
