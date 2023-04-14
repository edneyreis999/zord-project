import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  title: string;

  @ApiProperty({
    type: String,
    description: 'Book id',
    example: '5f9f1c9b9c9c1c0c8c8c8c8c',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  bookId: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Image file to upload',
  })
  file?: Express.Multer.File;
}
