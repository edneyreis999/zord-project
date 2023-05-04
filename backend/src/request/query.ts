/**
 * Tools to create query params using {@link https://jsonapi.org/}
 * Some references:
 *  - {@link https://github.com/nestjs/swagger/issues/90}
 */
import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Transform, Type, TypeHelpOptions } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

/**
 * Validation to query pages
 */
export class PaginateQueryPage {
  @ApiPropertyOptional({
    name: 'page[offset]',
    type: Number,
    description: 'Number of records to skip (Example: 0)',
    default: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  @Expose()
  offset = 0;

  @ApiPropertyOptional({
    name: 'page[limit]',
    type: Number,
    description: 'Number of records to return (Example: 10)',
    default: 10,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  @Expose()
  limit = 10;
}

/**
 * Decorator to 'sort' query params
 * @see {@link https://jsonapi.org/format/1.1/#fetching-sorting}
 * @param fields - List of fields available to sort
 * @example
 * ```ts
 * class MyQueryDto {
 *   @Sort(['createdAt', '-createdAt'])
 *   sort?: string[]
 * }
 * ```
 */
export function Sort(fields: string[]) {
  const example = fields.filter((v) => v.includes('-')).join(',');
  return applyDecorators(
    ApiPropertyOptional({
      name: 'sort',
      description: `Sort the results (Example: ${example})`,
      type: String,
    }),
    IsOptional(),
    IsArray(),
    IsIn(fields, { each: true }),
    Transform(({ value }) =>
      typeof value === 'string' ? value.split(',') : value,
    ),
    Expose(),
  );
}

/**
 * Decorator to 'include' query params
 * @see {@link https://jsonapi.org/format/1.1/#fetching-includes}
 * @param fields - List of fields available to include
 * @example
 * ```ts
 * class MyQueryDto {
 *   @Include(['chapters', 'chapters.arc'])
 *   include?: string[]
 * }
 * ```
 */
export function Include(fields: string[]) {
  return applyDecorators(
    ApiPropertyOptional({
      name: 'include',
      description: `Populate the resource separated by a comma. (Example: ${fields.join(
        ',',
      )})`,
      type: String,
    }),
    IsOptional(),
    IsArray(),
    IsIn(fields, { each: true }),
    Transform(({ value }) =>
      typeof value === 'string' ? value.split(',') : value,
    ),
    Expose(),
  );
}

/**
 * Decorator to 'page' query params
 * @see {@link https://jsonapi.org/format/1.1/#fetching-pagination}
 * @example
 * ```ts
 * class MyQueryDto {
 *   @Page()
 *   page?: PaginateQueryPage
 * }
 * ```
 */
export function Page() {
  return applyDecorators(
    ApiPropertyOptional({
      name: 'page',
      description: 'Paginate the results',
    }),
    ValidateNested(),
    IsOptional(),
    Type(() => PaginateQueryPage),
    Expose(),
  );
}

/**
 * Decorator to 'filter' query params
 * @see {@link https://jsonapi.org/format/1.1/#fetching-filtering}
 * @example
 * ```ts
 * class MyQueryDto {
 *   @Filter(() => MyFilterResource)
 *   filter?: MyFilterResource
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function Filter(typeFunction?: (type?: TypeHelpOptions) => Function) {
  return applyDecorators(
    ApiProperty({
      name: 'filter',
      description: 'Filter the results',
    }),
    ValidateNested(),
    IsDefined(),
    Type(typeFunction),
    Expose(),
  );
}

/**
 * Interface of query params to GET all resources
 */
export interface QueryDto {
  filter?: FilterDto;
  page?: PaginateQueryPage;
  sort?: string[];
  include?: string[];
}

export class FilterByIdDto {
  @ApiProperty({
    name: 'filter[id]',
    description: 'Search by id (Example: 6431a7c0272aea5bdcfa550f)',
  })
  @IsString()
  @IsDefined()
  @Expose()
  @IsMongoId({
    message: 'id invalid',
  })
  id: string;
}

export class FilterDto extends PartialType(FilterByIdDto) {}
