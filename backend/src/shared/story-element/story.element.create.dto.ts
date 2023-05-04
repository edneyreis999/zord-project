import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsDefined,
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
