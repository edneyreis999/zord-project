import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Filter, FilterByIdDto, Include } from '../../request/query';
import {
  StoryElementQueryManyDto,
  StoryElementQueryOneDto,
} from '../../shared/story-element/story.element.query.filter.dto';

class FilterManyChapterDto {
  @ApiProperty({
    name: 'filter[bookId]',
    description: 'Search by bookId (Example: 6431a7c0272aea5bdcfa550f)',
  })
  @IsString()
  @IsDefined()
  @Expose()
  @IsMongoId({
    message: 'bookId invalid',
  })
  bookId: string;

  @ApiPropertyOptional({
    name: 'filter[id]',
    description: 'Search by id (Example: 6431a7c0272aea5bdcfa550f)',
  })
  @IsString()
  @IsOptional()
  @Expose()
  @IsMongoId({
    message: 'id invalid',
  })
  id: string;

  @ApiPropertyOptional({
    name: 'filter[title]',
    description: 'Search for name (Example: Ghork)',
  })
  @IsString()
  @IsOptional()
  @Expose()
  readonly title?: string;

  @ApiPropertyOptional({
    name: 'filter[slug]',
    description: 'Search for slug (Example: ghork)',
  })
  @IsString()
  @IsOptional()
  @Expose()
  readonly slug?: string;
}

export class QueryOneChapterDto extends StoryElementQueryOneDto {
  @Include(['book', 'arc'])
  readonly include?: string[];

  @Filter(() => FilterByIdDto)
  filter: FilterByIdDto;
}

export class QueryManyChapterDto extends StoryElementQueryManyDto {
  @Filter(() => FilterManyChapterDto)
  filter: FilterManyChapterDto;

  @Include(['book', 'arc'])
  readonly include?: string[];
}
