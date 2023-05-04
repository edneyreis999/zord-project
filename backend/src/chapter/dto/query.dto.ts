import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsMongoId, IsString } from 'class-validator';
import { Filter, FilterByIdDto, Include } from '../../request/query';
import {
  FilterManyStoryElementDto,
  StoryElementQueryManyDto,
  StoryElementQueryOneDto,
} from '../../shared/story-element/story.element.query.filter.dto';

class FilterManyChapterDto extends FilterManyStoryElementDto {
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
