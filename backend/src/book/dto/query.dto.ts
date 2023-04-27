import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';
import { BasicFilterDto, Filter, Include } from '../../request/query';
import {
  StoryElementFilterDto,
  StoryElementQueryManyDto,
} from '../../shared/story-element/story.element.query.filter.dto';
import { IsValidObjectIdAndExists } from '../../shared/validations/validation.objectId-exists';
import { CustomServiceValidate } from '../../request/custom.service.validate';

export class FilterBookDto extends BasicFilterDto {
  @ApiPropertyOptional({
    name: 'filter[id]',
    description: 'Search by filter[id] (Example: 6431a7c0272aea5bdcfa550f)',
  })
  @IsString()
  @IsOptional()
  @Expose()
  @CustomServiceValidate(IsValidObjectIdAndExists, {
    service: 'BookService',
    method: 'findById',
  })
  id?: string;
}

export class BookBasicFilterDto {
  @Filter(() => FilterBookDto)
  filter?: FilterBookDto;
}
export class QueryOneBookDto extends BookBasicFilterDto {
  @Include(['chapters'])
  readonly include?: string[];

  @Filter(() => FilterBookDto)
  filter?: FilterBookDto;
}

export class QueryManyBookDto extends StoryElementQueryManyDto {
  @Filter(() => StoryElementFilterDto)
  readonly filter?: StoryElementFilterDto;

  @Include(['chapters'])
  readonly include?: string[];
}
