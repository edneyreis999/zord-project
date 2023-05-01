import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsDefined,
  IsMongoId,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateChapterDto {
  @ApiProperty({
    name: 'id',
    description: 'Chapter id (Example: 6431a7c0272aea5bdcfa550f)',
  })
  @IsString()
  @IsDefined()
  @Expose()
  @IsMongoId({
    message: 'id invalid',
  })
  id: string;

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
    name: 'summary',
    type: String,
    description: 'Summary (Example: lorem ipsum dolor sit amet)',
  })
  @IsString()
  @IsDefined()
  @MaxLength(300)
  summary: string;

  @ApiProperty({
    name: 'content',
    type: String,
    description:
      'Content of the chapter (Example: <arc><scene>lorem ipsum dolor sit amet</scene></arc>)',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  content: string;

  @ApiPropertyOptional({
    name: 'order',
    type: Number,
    description: 'order (Example: 1)',
    minimum: 1,
  })
  @IsOptional()
  @IsNumberString()
  order: number;
}

export class PatchChapterDto extends PartialType(
  OmitType(UpdateChapterDto, ['id'] as const),
) {
  @ApiProperty({
    name: 'id',
    description: 'Chapter id (Example: 6431a7c0272aea5bdcfa550f)',
  })
  @IsString()
  @IsDefined()
  @Expose()
  @IsMongoId({
    message: 'id invalid',
  })
  id: string;
}
