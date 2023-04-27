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
import { CustomServiceValidate } from '../../request/custom.service.validate';
import { IsValidObjectIdAndExists } from '../validations/validation.objectId-exists';

export class CreateStoryElementDto {
  @ApiProperty({
    name: 'title',
    type: String,
    description: 'Title (Example: My beautiful title)',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Validate(UniqueTitle)
  title: string;

  @ApiProperty({
    type: String,
    name: 'bookId',
    description: 'Book id (Example: 5f9f1c9b9c9c1c0c8c8c8c8c)',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @CustomServiceValidate(IsValidObjectIdAndExists, {
    service: 'BookService',
    method: 'findById',
  })
  bookId: string;

  @ApiPropertyOptional({
    name: 'summary',
    type: String,
    description: 'Summary (Example: lorem ipsum dolor sit amet)',
  })
  @IsString()
  @IsOptional()
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
  @SetValidOrder()
  order?: number;
}
