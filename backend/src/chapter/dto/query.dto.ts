import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsOptional, IsDefined } from 'class-validator';
import { Filter, Include } from '../../request/query';
import {
  StoryElementFilterDto,
  StoryElementQueryManyDto,
  StoryElementQueryOneDto,
} from '../../shared/story-element/story.element.query.filter.dto';
import { IsValidObjectIdAndExists } from '../../shared/validations/validation.objectId-exists';
import { CustomServiceValidate } from '../../request/custom.service.validate';

export class ChapterFindByIdDto {
  @ApiProperty({
    name: 'filter[id]',
    description: 'Search by id (Example: 6431a7c0272aea5bdcfa550f)',
  })
  @IsString()
  @IsDefined()
  @Expose()
  @CustomServiceValidate(IsValidObjectIdAndExists, {
    service: 'ChapterService',
    method: 'findById',
  })
  id: string;
}
class FilterChapterDto extends StoryElementFilterDto {
  @ApiPropertyOptional({
    name: 'filter[id]',
    description: 'Search by id (Example: 6431a7c0272aea5bdcfa550f)',
  })
  @IsString()
  @IsOptional()
  @Expose()
  @CustomServiceValidate(IsValidObjectIdAndExists, {
    service: 'ChapterService',
    method: 'findById',
  })
  id?: string;

  @ApiPropertyOptional({
    name: 'filter[bookId]',
    description: 'Search for book ID',
    example: 'Ghork',
  })
  @IsString()
  @IsOptional()
  @Expose()
  @CustomServiceValidate(IsValidObjectIdAndExists, {
    service: 'BookService',
    method: 'findById',
  })
  bookId?: string;
}

export class ChapterBasicFilterDto {
  @Filter(() => ChapterFindByIdDto)
  filter?: ChapterFindByIdDto;
}

export class QueryOneChapterDto extends StoryElementQueryOneDto {
  @Include(['book, arc'])
  readonly include?: string[];

  @Filter(() => FilterChapterDto)
  filter?: FilterChapterDto;
}

export class QueryManyChapterDto extends StoryElementQueryManyDto {
  @Filter(() => FilterChapterDto)
  filter?: FilterChapterDto;

  @Include(['book, arc'])
  readonly include?: string[];
}
