import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsMongoId, IsString } from 'class-validator';
import { Filter, FilterByIdDto, Include } from '../../request/query';
import {
  FilterManyStoryElementDto,
  StoryElementQueryManyDto,
  StoryElementQueryOneDto,
} from '../../shared/story-element/story.element.query.filter.dto';

class FilterManyArcDto extends FilterManyStoryElementDto {
  @ApiProperty({
    name: 'filter[chapterId]',
    description: 'Search by chapterId (Example: 6431a7c0272aea5bdcfa550f)',
  })
  @IsString()
  @IsDefined()
  @Expose()
  @IsMongoId({
    message: 'chapterId invalid',
  })
  chapterId: string;
}

export class QueryOneArcDto extends StoryElementQueryOneDto {
  @Include(['chapter', 'arc'])
  readonly include?: string[];

  @Filter(() => FilterByIdDto)
  filter: FilterByIdDto;
}

export class QueryManyArcDto extends StoryElementQueryManyDto {
  @Filter(() => FilterManyArcDto)
  filter: FilterManyArcDto;

  @Include(['chapter'])
  readonly include?: string[];
}
