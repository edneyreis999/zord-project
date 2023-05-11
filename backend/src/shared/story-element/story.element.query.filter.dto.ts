import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import {
  Filter,
  FilterByIdDto,
  FilterDto,
  Include,
  Page,
  PaginateQueryPage,
  QueryDto,
  Sort,
} from '../../request/query';

export class FilterManyStoryElementDto extends FilterDto {
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

export abstract class StoryElementQueryManyDto implements QueryDto {
  abstract filter: FilterManyStoryElementDto;

  @Sort(['title', '-title', 'createdAt', '-createdAt'])
  sort?: string[];

  @Page()
  page?: PaginateQueryPage;

  abstract include?: string[];
}

export abstract class StoryElementQueryOneDto {
  @Filter(() => FilterByIdDto)
  filter: FilterByIdDto;

  @Include([])
  include?: string[];
}
