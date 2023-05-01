import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsDefined,
  IsMongoId,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateStoryElementDto {
  @ApiProperty({
    name: 'title',
    type: String,
    description: 'Title (Example: My beautiful title)',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @ApiProperty({
    type: String,
    name: 'bookId',
    description: 'Book id (Example: 5f9f1c9b9c9c1c0c8c8c8c8c)',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsMongoId({
    message: 'book id invalid',
  })
  bookId: string;

  @ApiPropertyOptional({
    name: 'summary',
    type: String,
    description: 'Summary (Example: lorem ipsum dolor sit amet)',
  })
  @IsString()
  @IsOptional()
  @MaxLength(300)
  summary?: string;

  @ApiProperty({
    name: 'content',
    type: String,
    description:
      'Content of the chapter (Example: <arc><scene>lorem ipsum dolor sit amet</scene></arc>)',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    name: 'order',
    type: Number,
    description: 'order (Example: 1)',
    minimum: 1,
  })
  @IsOptional()
  @IsNumberString()
  order?: number;
}
