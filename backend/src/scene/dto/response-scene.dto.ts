import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ResponseBookDto } from '../../book/dto/response.dto';
import { Book } from '../../book/schemas/book.schema';
import { Scene } from '../schemas/scene.schema';

export class ResponseSceneDto {
  static fromScene(scene: Scene | Types.ObjectId): ResponseSceneDto {
    if (scene instanceof Types.ObjectId) {
      return {
        id: scene.toString(),
      };
    } else {
      return {
        id: scene._id.toString(),
        title: scene.title,
        slug: scene.slug,
        content: scene.content,
        order: scene.order,
        summary: scene.summary,
        createdAt: scene?.createdAt?.toISOString(),
        updatedAt: scene?.updatedAt?.toISOString(),
      };
    }
  }

  static fromManyScenes(scenes: Scene[]): ResponseSceneDto[] {
    return scenes.map(ResponseSceneDto.fromScene);
  }

  @ApiProperty({
    type: String,
    description: 'id of the book',
    example: '896e54c2-65e2-11ed-9022-0242ac120002',
  })
  readonly id: string;

  @ApiProperty({
    type: String,
    description: 'Scene Name',
    example: 'scene 1',
  })
  readonly title?: string;

  @ApiProperty({
    type: String,
    description: 'slug of the scene',
    example: 'ghork',
  })
  readonly slug?: string;

  @ApiProperty({
    type: Book,
    description: 'Book of the scene',
    example: "Ghork's story",
  })
  readonly book?: ResponseBookDto;

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'List of arcs of this scene',
    example: ['O plano de Lala', 'Prova de Fogo'],
  })
  readonly arcs?: string[];

  @ApiProperty({
    type: String,
    description: 'Content of the scene',
    example: 'lorem ipsum dolor sit amet',
  })
  readonly content?: string;

  @ApiProperty({
    type: String,
    description: 'order of the scene',
    example: '1',
  })
  readonly order?: number;

  @ApiProperty({
    type: String,
    description: 'Summary of the scene',
    example: 'lorem ipsum dolor sit amet',
  })
  readonly summary?: string;

  @ApiProperty({
    type: String,
    description: 'Date of the creation of the scene',
    example: '2022-11-16T19:10:48.059Z',
  })
  readonly createdAt?: string;

  @ApiProperty({
    type: String,
    description: 'Date of the last update of the scene',
    example: '2022-11-16T19:10:48.059Z',
  })
  readonly updatedAt?: string;
}
