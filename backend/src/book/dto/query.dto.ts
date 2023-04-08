import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import {
  QueryDto,
  Filter,
  Sort,
  Page,
  PaginateQueryPage,
  Include,
} from '../../request/query';

class FilterBookDto {
  @ApiPropertyOptional({
    name: 'filter[id]',
    description: 'Search for id',
    example: '6431a7c0272aea5bdcfa550f',
  })
  @IsString()
  @IsOptional()
  @Expose()
  id?: string;

  @ApiPropertyOptional({
    name: 'filter[name]',
    description: 'Search for name',
    example: 'Ghork',
  })
  @IsString()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiPropertyOptional({
    name: 'filter[slug]',
    description: 'Search for slug',
    example: 'ghork',
  })
  @IsString()
  @IsOptional()
  @Expose()
  slug?: string;
}

export class QueryOneBookDto implements QueryDto {
  constructor(data: Partial<QueryOneBookDto> = {}) {
    Object.assign(this, data);
  }

  @Include(['chapters', 'chapters.arc'])
  include?: string[];
}

export class QueryManyBookDto implements QueryDto {
  constructor(data: Partial<QueryManyBookDto> = {}) {
    Object.assign(this, data);
  }

  @Filter(() => FilterBookDto)
  filter?: FilterBookDto;

  @Sort(['name', '-name', 'createdAt', '-createdAt'])
  sort?: string[];

  @Page()
  page?: PaginateQueryPage;

  @Include(['chapters', 'chapters.arc'])
  include: string[];
}
