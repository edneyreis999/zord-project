import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsOptional, Validate } from 'class-validator';
import { Filter, Include } from '../../request/query';
import {
  StoryElementFilterDto,
  StoryElementQueryManyDto,
  StoryElementQueryOneDto,
} from '../../shared/story-element/story.element.query.filter.dto';
import { IsValidObjectIdAndExists } from '../../shared/validations/validation.objectId-exists';

class FilterChapterDto extends StoryElementFilterDto {
  @ApiPropertyOptional({
    name: 'filter[id]',
    description: 'Search by id (Example: 6431a7c0272aea5bdcfa550f)',
  })
  @IsString()
  @IsOptional()
  @Expose()
  @Validate(IsValidObjectIdAndExists)
  id?: string;

  @ApiProperty({
    name: 'filter[bookId]',
    description: 'Search for book ID',
    example: 'Ghork',
  })
  @IsString()
  @IsOptional()
  @Expose()
  @Validate(IsValidObjectIdAndExists)
  bookId?: string;
}

export class QueryOneChapterDto extends StoryElementQueryOneDto {
  readonly type = 'QueryOneChapterDto';

  @Include(['book, arc'])
  readonly include?: string[];
}

export class QueryManyChapterDto extends StoryElementQueryManyDto {
  @Filter(() => FilterChapterDto)
  filter?: FilterChapterDto;

  @Include(['book, arc'])
  readonly include?: string[];
}
