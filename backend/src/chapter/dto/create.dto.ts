import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';

import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateChapterDto {
  @ApiProperty({
    type: String,
    description: 'Chapter name',
    example: 'Chapter 1',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image file to upload',
  })
  file: Express.Multer.File;
}
