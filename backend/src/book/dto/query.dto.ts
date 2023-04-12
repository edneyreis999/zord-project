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
  readonly id?: string;

  @ApiPropertyOptional({
    name: 'filter[name]',
    description: 'Search for name',
    example: 'Ghork',
  })
  @IsString()
  @IsOptional()
  @Expose()
  readonly name?: string;

  @ApiPropertyOptional({
    name: 'filter[slug]',
    description: 'Search for slug',
    example: 'ghork',
  })
  @IsString()
  @IsOptional()
  @Expose()
  readonly slug?: string;
}

export class QueryOneBookDto implements QueryDto {
  @Include(['chapters', 'chapters.arc'])
  readonly include?: string[];
}

export class QueryManyBookDto implements QueryDto {
  @Filter(() => FilterBookDto)
  readonly filter?: FilterBookDto;

  @Sort(['name', '-name', 'createdAt', '-createdAt'])
  readonly sort?: string[];

  @Page()
  readonly page?: PaginateQueryPage;

  @Include(['chapters', 'chapters.arc'])
  readonly include?: string[];
}
