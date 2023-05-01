import { Filter, FilterByIdDto, Include } from '../../request/query';
import {
  StoryElementFilterDto,
  StoryElementQueryManyDto,
} from '../../shared/story-element/story.element.query.filter.dto';

export class BookBasicFilterDto {
  @Filter(() => FilterByIdDto)
  filter: FilterByIdDto;
}
export class QueryOneBookDto extends BookBasicFilterDto {
  @Include(['chapters'])
  readonly include?: string[];

  @Filter(() => FilterByIdDto)
  filter: FilterByIdDto;
}

export class QueryManyBookDto extends StoryElementQueryManyDto {
  @Filter(() => StoryElementFilterDto)
  readonly filter: StoryElementFilterDto;

  @Include(['chapters'])
  readonly include?: string[];
}
