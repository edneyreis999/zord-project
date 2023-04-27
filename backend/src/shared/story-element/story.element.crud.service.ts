import { Injectable } from '@nestjs/common';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { StoryElement } from '../../interfaces/story.element';
import {
  StoryElementQueryManyDto,
  StoryElementQueryOneDto,
} from './story.element.query.filter.dto';

/**
 * StoryElementCrudService is an abstract class that provides generic CRUD
 * operations for story elements such as Book, Chapter, Arc, and Scene. This
 * class should be extended by specific services for each story element.
 */
@Injectable()
export abstract class StoryElementCrudService<T extends StoryElement> {
  protected abstract availableFieldsToInclude: string[];

  constructor(protected model: Model<T>) {}

  // Create a new story element and save it to the database
  async create(dto: Partial<T>): Promise<T> {
    const slug = this.generateSlug(dto.title);
    const model = new this.model({
      slug,
      ...dto,
    });
    const saved = await model.save();
    return saved;
  }

  // Find all story elements in the database that match the provided filters and query parameters
  async findAll(queryDto: StoryElementQueryManyDto): Promise<T[]> {
    const { filter, include, page, sort } = queryDto;
    const { id, slug, title } = filter ?? {};

    const queryFilter: FilterQuery<T> = {};

    if (id) {
      queryFilter._id = id;
      const chapterQuery = this.model.find(queryFilter);
      if (include) {
        this.populateWithIncludes(chapterQuery, include);
      }

      return chapterQuery.exec();
    }

    if (title) {
      queryFilter.title = new RegExp(title, 'i');
    }
    queryFilter.slug = new RegExp(slug, 'i');
    if (slug) {
    }

    const sortQuery = this.createSortQuery(sort);

    const { offset, limit } = page ?? {};

    const chapterQuery = this.model
      .find(queryFilter)
      .sort(sortQuery)
      .skip(offset)
      .limit(limit);

    if (include) {
      this.populateWithIncludes(chapterQuery, include);
    }

    return chapterQuery.exec();
  }

  // Find a single story element in the database based on the provided filter
  async findOne(queryDto: StoryElementQueryOneDto): Promise<T | undefined> {
    const { include, filter } = queryDto;
    const { id } = filter;

    const query = this.model.findOne({ _id: id });

    this.populateWithIncludes(query, include);

    return query.exec();
  }

  async findById(id: string): Promise<T | undefined> {
    const query = this.model.findById(id);

    return query.exec();
  }

  // Delete a story element from the database by its ID
  async delete(id: string): Promise<T> {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    return deleted;
  }

  // Update a story element in the database with the provided ID and data
  async update(id: string, dto: Partial<T>): Promise<T> {
    const updateData: Partial<T> = { ...dto };
    if (dto.title) {
      updateData.slug = this.generateSlug(dto.title);
    }

    const storyElementUpdated = await this.model.findOneAndUpdate(
      { _id: id },
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run validations on the update
      },
    );

    return storyElementUpdated;
  }

  // Generate a URL-friendly slug from the provided text
  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove non-alphanumeric characters, spaces, and hyphens
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
  }

  // Add fields to populate based on the provided include array
  private populateWithIncludes(query, include?: string[]) {
    include = include ?? [];
    include.forEach((field) => {
      if (this.availableFieldsToInclude.includes(field)) {
        query.populate(field);
      }
    });
  }

  private createSortQuery(sort: string[] | undefined): {
    [key: string]: SortOrder;
  } {
    if (!sort) {
      return {};
    }

    return sort.reduce((sortQuery, sortItem) => {
      const [key, order] =
        sortItem[0] === '-' ? [sortItem.slice(1), -1] : [sortItem, 1];
      return { ...sortQuery, [key]: order };
    }, {});
  }
}
