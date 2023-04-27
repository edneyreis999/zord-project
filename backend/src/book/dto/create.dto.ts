import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    type: String,
    description: 'Book title (Example: Book 1)',
    maxLength: 50,
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(50)
  readonly title: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Book Summary (Example: lorem ipsum dolor sit amet)',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  summary?: string;
}
