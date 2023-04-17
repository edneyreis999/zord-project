import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';
import { Filter, Include } from '../../request/query';
import {
  StoryElementFilterDto,
  StoryElementQueryManyDto,
  StoryElementQueryOneDto,
} from '../../shared/story-element/story.element.query.filter.dto';

class FilterChapterDto extends StoryElementFilterDto {
  @ApiProperty({
    name: 'filter[bookId]',
    description: 'Search for book ID',
    example: 'Ghork',
  })
  @IsString()
  @IsOptional()
  @Expose()
  bookId?: string;
}

export class QueryOneChapterDto extends StoryElementQueryOneDto {
  @Include(['book, arc'])
  readonly include?: string[];
}

export class QueryManyChapterDto extends StoryElementQueryManyDto {
  @Filter(() => FilterChapterDto)
  filter?: FilterChapterDto;

  @Include(['book, arc'])
  readonly include?: string[];
}
