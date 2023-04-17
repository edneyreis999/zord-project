import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilterQuery, Model, Types } from 'mongoose';
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
    const queryFilter: FilterQuery<T> = {};
    const { filter, include, page, sort } = queryDto;
    const { id, slug, title } = filter ?? {};

    if (id) {
      if (Types.ObjectId.isValid(id)) {
        queryFilter._id = id;
      } else {
        throw new BadRequestException(`Invalid ID: ${id}`);
      }
    }
    if (title) {
      queryFilter.title = new RegExp(filter.title, 'i'); // Add this line to enable case-insensitive partial matching
    }
    if (slug) {
      queryFilter.slug = new RegExp(filter.slug, 'i'); // Add this line to enable case-insensitive partial matching
    }

    const sortQuery = {};
    if (sort) {
      sort.forEach((sortItem) => {
        const [key, order] =
          sortItem[0] === '-' ? [sortItem.slice(1), -1] : [sortItem, 1];
        sortQuery[key] = order;
      });
    }

    const pagination = {
      skip: page?.offset,
      limit: page?.limit,
    };

    const chapterQuery = this.model
      .find(queryFilter)
      .sort(sortQuery)
      .skip(pagination.skip)
      .limit(pagination.limit);

    if (include) {
      this.populateWithIncludes(chapterQuery, include);
    }

    return chapterQuery.exec();
  }

  // Find a single story element in the database based on the provided filter
  async findOne(queryDto: StoryElementQueryOneDto): Promise<T | undefined> {
    const { include, filter } = queryDto;
    const { id } = filter;

    const query = this.model.findById(id);

    this.populateWithIncludes(query, include);

    return query.exec();
  }

  // Delete a story element from the database by its ID
  async delete(id: string): Promise<T> {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
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

    if (!storyElementUpdated) {
      throw new NotFoundException(
        `Story Element ${this.model.name} not found by id: ${id}`,
      );
    }

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
}
