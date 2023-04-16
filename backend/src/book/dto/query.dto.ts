import { Filter, Include, Sort } from '../../request/query';
import {
  StoryElementFilterDto,
  StoryElementQueryManyDto,
  StoryElementQueryOneDto,
} from '../../shared/story-element/story.element.query.filter.dto';

class FilterBookDto extends StoryElementFilterDto {}
export class QueryOneBookDto extends StoryElementQueryOneDto {
  @Include(['chapters'])
  readonly include?: string[];
}

export class QueryManyBookDto extends StoryElementQueryManyDto {
  @Filter(() => FilterBookDto)
  readonly filter?: FilterBookDto;

  @Include(['chapters'])
  readonly include?: string[];

  @Sort(['title', '-title', 'createdAt', '-createdAt'])
  readonly sort?: string[];
}
