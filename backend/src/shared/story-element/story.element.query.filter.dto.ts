import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import {
  Filter,
  FilterByIdDto,
  Include,
  Page,
  PaginateQueryPage,
  QueryDto,
  Sort,
} from '../../request/query';

export class StoryElementFilterDto extends FilterByIdDto {
  constructor(partial: Partial<StoryElementFilterDto>) {
    super();
    Object.assign(this, partial);
  }

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
  @Filter(() => StoryElementFilterDto)
  filter: StoryElementFilterDto;

  @Sort(['title', '-title', 'createdAt', '-createdAt'])
  sort?: string[];

  @Page()
  page?: PaginateQueryPage;

  @Include([])
  include?: string[];
}

export abstract class StoryElementQueryOneDto {
  @Filter(() => FilterByIdDto)
  filter: FilterByIdDto;

  @Include([])
  include?: string[];
}
