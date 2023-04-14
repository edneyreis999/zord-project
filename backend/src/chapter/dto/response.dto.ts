import { ApiProperty } from '@nestjs/swagger';

export class ResponseChapterDto {
  @ApiProperty({
    type: String,
    description: 'Chapter Name',
    example: 'chapter 1',
  })
  title: string;

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'List of arcs of this chapter',
    example: ['O plano de Lala', 'Prova de Fogo'],
  })
  arcs: string[];
}
