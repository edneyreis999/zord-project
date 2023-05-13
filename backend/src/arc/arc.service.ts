import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { StoryElementCrudService } from '../shared/story-element/story.element.crud.service';
import { QueryManyArcDto } from './dto/query-scene.dto';
import { IArc } from './interface/arc';
import { Arc } from './schemas/arc.schema';

@Injectable()
export class ArcService extends StoryElementCrudService<Arc> {
  protected availableFieldsToInclude = ['chapter'];

  constructor(@InjectModel(Arc.name) private arcModel: Model<Arc>) {
    super(arcModel);
  }

  async create(arc: IArc): Promise<Arc> {
    const createdArc = await super.create({
      ...arc,
    });

    return createdArc;
  }

  findAll(queryDto: QueryManyArcDto) {
    const { filter, include, page, sort } = queryDto;
    const { id, chapterId, slug, title } = filter;

    const queryFilter: FilterQuery<Arc> = {
      chapter: chapterId,
    };

    if (id) {
      queryFilter._id = id;
      const arcQuery = this.model.find(queryFilter);
      if (include) {
        super.populateWithIncludes(arcQuery, include);
      }

      return arcQuery.exec();
    }
    if (title) {
      queryFilter.title = new RegExp(title, 'i');
    }
    queryFilter.slug = new RegExp(slug, 'i');
    if (slug) {
    }

    const sortQuery = this.createSortQuery(sort);

    const { offset, limit } = page ?? {};

    const arcQuery = this.model
      .find(queryFilter)
      .sort(sortQuery)
      .skip(offset)
      .limit(limit);

    if (include) {
      this.populateWithIncludes(arcQuery, include);
    }

    return arcQuery.exec();
  }

  /**
   * Find a arc by its ID and optionally include related data.
   *
   * @param {string} id - The ID of the arc to be fetched.
   * @param {string[]} [include=this.availableFieldsToInclude] - An array of related fields to include in the response.
   * @returns {Promise<Book>} A promise that resolves to the found arc with its related data included based on the `include` parameter.
   */
  async findById(id: string, include?: string[]): Promise<Arc> {
    const arc = await super.findById(id, include);
    // this.cls.set('arc', arc);
    return arc;
  }
}
