import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { UniqueTitle } from '../validations/validation.title';
import { SetValidOrder } from '../validations/validation.order';

export class CreateStoryElementDto {
  @ApiProperty({
    type: String,
    description: 'Title (Example: My beautiful title)',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Validate(UniqueTitle)
  title: string;

  @ApiProperty({
    type: String,
    description: 'Book id (Example: 5f9f1c9b9c9c1c0c8c8c8c8c)',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  bookId: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Summary (Example: lorem ipsum dolor sit amet)',
  })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({
    type: String,
    description:
      'Content of the chapter (Example: <arc><scene>lorem ipsum dolor sit amet</scene></arc>)',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'order (Example: 1)',
    minimum: 1,
  })
  @SetValidOrder()
  @IsOptional()
  order?: number;
}
