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

class FilterChapterDto {
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
    description: 'Search for chapter name',
    example: 'Ghork',
  })
  @IsString()
  @IsOptional()
  @Expose()
  readonly title?: string;

  @ApiPropertyOptional({
    name: 'filter[slug]',
    description: 'Search for chapter slug',
    example: 'ghork',
  })
  @IsString()
  @IsOptional()
  @Expose()
  readonly slug?: string;
}

export class QueryOneChapterDto implements QueryDto {
  @Filter(() => FilterChapterDto)
  readonly filter?: FilterChapterDto;

  @Include(['arc'])
  readonly include?: string[];
}

export class QueryManyChapterDto implements QueryDto {
  @Filter(() => FilterChapterDto)
  readonly filter?: FilterChapterDto;

  @Sort(['name', '-name', 'createdAt', '-createdAt'])
  readonly sort?: string[];

  @Page()
  readonly page?: PaginateQueryPage;

  @Include(['arc'])
  readonly include?: string[];
}
