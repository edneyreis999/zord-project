import { ApiProperty } from '@nestjs/swagger';
import { CreateBookDto } from './create.dto';
import { Book } from '../../schemas/book';
import { Chapter } from '../../schemas/chapter';

export class ResponseBookDto extends CreateBookDto {
  static fromBook(book: Book): ResponseBookDto {
    const dto = new ResponseBookDto();
    dto.id = book._id.toString();
    dto.name = book.name;
    dto.slug = book.slug;
    dto.chapters = book.chapters;
    dto.createdAt = book.createdAt.toISOString();
    dto.updatedAt = book.updatedAt.toISOString();
    return dto;
  }

  static fromManyBooks(books: Book[]): ResponseBookDto[] {
    return books.map(ResponseBookDto.fromBook);
  }

  @ApiProperty({
    type: String,
    description: 'id of the book',
    example: '896e54c2-65e2-11ed-9022-0242ac120002',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'slug of the book',
    example: 'ghork',
  })
  slug: string;

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'List of chapters of this book',
    example: ['Chapter 1', 'Chapter 2'],
  })
  chapters: Chapter[];

  @ApiProperty({
    type: String,
    description: 'Date of created the book',
    example: '2022-11-16T19:10:48.059Z',
  })
  createdAt: string;

  @ApiProperty({
    type: String,
    description: 'Date of updated the book',
    example: '2022-11-16T19:10:48.059Z',
  })
  updatedAt: string;
}
