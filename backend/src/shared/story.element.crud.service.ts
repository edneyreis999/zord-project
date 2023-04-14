import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types } from 'mongoose';
import { StoryElement } from '../interfaces/story.element';

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
    return model.save();
  }

  // Find all story elements in the database that match the provided filters and query parameters
  async findAll(queryDto: any): Promise<T[]> {
    const filter: FilterQuery<T> = {};

    if (queryDto.filter?.name) {
      filter.title = new RegExp(queryDto.filter.title, 'i'); // Add this line to enable case-insensitive partial matching
    }
    if (queryDto.filter?.slug) {
      filter.slug = new RegExp(queryDto.filter.slug, 'i'); // Add this line to enable case-insensitive partial matching
    }

    const sort = {};
    if (queryDto.sort) {
      queryDto.sort.forEach((sortItem) => {
        const [key, order] =
          sortItem[0] === '-' ? [sortItem.slice(1), -1] : [sortItem, 1];
        sort[key] = order;
      });
    }

    const pagination = {
      skip: queryDto.page?.offset,
      limit: queryDto.page?.limit,
    };

    const chapterQuery = this.model
      .find(filter)
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit);

    if (queryDto.include) {
      this.populateWithIncludes(chapterQuery, queryDto.include);
    }

    return chapterQuery.exec();
  }

  // Find a single story element in the database based on the provided filter
  async findOne(filter: string, queryDto?: any): Promise<T | undefined> {
    const query = { $or: [] };
    const { include } = queryDto ?? {};

    if (Types.ObjectId.isValid(filter)) {
      query.$or.push({ _id: filter });
    }
    query.$or.push({ name: filter });
    query.$or.push({ slug: filter });

    const bookQuery = this.model.findOne(query);

    this.populateWithIncludes(bookQuery, include);

    return bookQuery.exec();
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
  async update(id: string, dto: any): Promise<T> {
    const updateData: Partial<T> = { ...dto };
    if (dto.name) {
      updateData.slug = this.generateSlug(dto.name);
    }

    const updatedChapter = await this.model.findOneAndUpdate(
      { _id: id },
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run validations on the update
      },
    );

    if (!updatedChapter) {
      throw new NotFoundException('Chapter not found');
    }

    return updatedChapter;
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
    this.availableFieldsToInclude.forEach((field) => {
      if (include?.includes(field)) {
        query.populate(field);
      }
    });
  }
}
