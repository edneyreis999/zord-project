import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';
import {
  BasicFilterDto,
  Filter,
  Include,
  Page,
  PaginateQueryPage,
  QueryDto,
  Sort,
} from '../../request/query';

export class StoryElementFilterDto extends BasicFilterDto {
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
  filter?: StoryElementFilterDto;

  @Sort(['title', '-title', 'createdAt', '-createdAt'])
  sort?: string[];

  @Page()
  page?: PaginateQueryPage;

  @Include([])
  include?: string[];
}

export abstract class StoryElementQueryOneDto {
  @Filter(() => BasicFilterDto)
  filter?: BasicFilterDto;

  @Include([])
  include?: string[];
}
