import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ResponseChapterDto } from '../../chapter/dto/response.dto';
import { Book } from '../schemas/book.schema';

export class ResponseBookDto {
  static fromBook(book: Book | Types.ObjectId): ResponseBookDto {
    if (book instanceof Types.ObjectId) {
      return {
        id: book.toString(),
      };
    } else {
      return {
        id: book._id.toString(),
        title: book.title,
        slug: book.slug,
        chapters: ResponseChapterDto.fromManyChapters(book.chapters),
        summary: book.summary,
        createdAt: book.createdAt.toISOString(),
        updatedAt: book.updatedAt.toISOString(),
      };
    }
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
    description: 'title of the book',
    example: 'ghork',
  })
  readonly title?: string;

  @ApiProperty({
    type: String,
    description: 'slug of the book',
    example: 'ghork',
  })
  readonly slug?: string;

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'List of chapters of this book',
    example: ['Chapter 1', 'Chapter 2'],
  })
  readonly chapters?: ResponseChapterDto[];

  @ApiProperty({
    type: String,
    description: 'Summary of the book',
    example: 'lorem ipsum dolor sit amet',
  })
  readonly summary?: string;

  @ApiProperty({
    type: String,
    description: 'Date of created the book',
    example: '2022-11-16T19:10:48.059Z',
  })
  readonly createdAt?: string;

  @ApiProperty({
    type: String,
    description: 'Date of updated the book',
    example: '2022-11-16T19:10:48.059Z',
  })
  readonly updatedAt?: string;
}
