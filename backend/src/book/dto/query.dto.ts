import { Filter, FilterByIdDto, Include } from '../../request/query';
import {
  FilterManyStoryElementDto,
  StoryElementQueryManyDto,
  StoryElementQueryOneDto,
} from '../../shared/story-element/story.element.query.filter.dto';
export class QueryOneBookDto extends StoryElementQueryOneDto {
  @Include(['chapters'])
  readonly include?: string[];

  @Filter(() => FilterByIdDto)
  filter: FilterByIdDto;
}

export class QueryManyBookDto extends StoryElementQueryManyDto {
  @Filter(() => FilterManyStoryElementDto)
  readonly filter: FilterManyStoryElementDto;

  @Include(['chapters'])
  readonly include?: string[];
}
