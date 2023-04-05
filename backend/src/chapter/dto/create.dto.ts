import { ApiProperty } from '@nestjs/swagger';

import { IsDefined, IsString } from 'class-validator';

export class CreateChapterDto {
  @ApiProperty({
    type: String,
    description: 'Chapter name',
    example: 'Chapter 1',
  })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image file to upload',
  })
  file: Express.Multer.File;
}
