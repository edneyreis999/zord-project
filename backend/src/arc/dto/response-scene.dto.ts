import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ResponseBookDto } from '../../book/dto/response.dto';
import { Book } from '../../book/schemas/book.schema';
import { Arc } from '../schemas/arc.schema';

export class ResponseArcDto {
  static fromArc(arc: Arc | Types.ObjectId): ResponseArcDto {
    if (arc instanceof Types.ObjectId) {
      return {
        id: arc.toString(),
      };
    } else {
      return {
        id: arc._id.toString(),
        title: arc.title,
        slug: arc.slug,
        content: arc.content,
        order: arc.order,
        summary: arc.summary,
        createdAt: arc?.createdAt?.toISOString(),
        updatedAt: arc?.updatedAt?.toISOString(),
      };
    }
  }

  static fromManyArcs(arcs: Arc[]): ResponseArcDto[] {
    return arcs.map(ResponseArcDto.fromArc);
  }

  @ApiProperty({
    type: String,
    description: 'id of the book',
    example: '896e54c2-65e2-11ed-9022-0242ac120002',
  })
  readonly id: string;

  @ApiProperty({
    type: String,
    description: 'Arc Name',
    example: 'arc 1',
  })
  readonly title?: string;

  @ApiProperty({
    type: String,
    description: 'slug of the arc',
    example: 'ghork',
  })
  readonly slug?: string;

  @ApiProperty({
    type: Book,
    description: 'Book of the arc',
    example: "Ghork's story",
  })
  readonly book?: ResponseBookDto;

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'List of arcs of this arc',
    example: ['O plano de Lala', 'Prova de Fogo'],
  })
  readonly arcs?: string[];

  @ApiProperty({
    type: String,
    description: 'Content of the arc',
    example: 'lorem ipsum dolor sit amet',
  })
  readonly content?: string;

  @ApiProperty({
    type: String,
    description: 'order of the arc',
    example: '1',
  })
  readonly order?: number;

  @ApiProperty({
    type: String,
    description: 'Summary of the arc',
    example: 'lorem ipsum dolor sit amet',
  })
  readonly summary?: string;

  @ApiProperty({
    type: String,
    description: 'Date of the creation of the arc',
    example: '2022-11-16T19:10:48.059Z',
  })
  readonly createdAt?: string;

  @ApiProperty({
    type: String,
    description: 'Date of the last update of the arc',
    example: '2022-11-16T19:10:48.059Z',
  })
  readonly updatedAt?: string;
}
