import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    type: String,
    description: 'Book title',
    example: 'Book 1',
    maxLength: 50,
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(50)
  readonly title: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Book Summary',
    example: 'lorem ipsum dolor sit amet',
  })
  @IsString()
  @IsNotEmpty()
  summary?: string;
}
