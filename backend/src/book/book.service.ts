import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Book } from '../schemas/book';
import { QueryManyBookDto, QueryOneBookDto } from './dto/query.dto';
import { PatchBookDto } from './dto/patch.dto';
import { CreateBookDto } from './dto/create.dto';

@Injectable()
export class BookService {
  private availableFieldsToInclude = ['chapters', 'chapters.arc'];

  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  async create(defaultData: Partial<Book> & CreateBookDto): Promise<Book> {
    const slug = this.generateSlug(defaultData.name);
    const book = new this.bookModel({
      slug,
      ...defaultData,
    });
    return book.save();
  }

  async findAll(query: QueryManyBookDto): Promise<Book[]> {
    const filter: FilterQuery<Book> = {};

    if (query.filter?.name) {
      filter.name = query.filter.name;
    }
    if (query.filter?.slug) {
      filter.slug = query.filter.slug;
    }

    const sort = {};
    if (query.sort) {
      query.sort.forEach((sortItem) => {
        const [key, order] =
          sortItem[0] === '-' ? [sortItem.slice(1), -1] : [sortItem, 1];
        sort[key] = order;
      });
    }

    const pagination = {
      skip: query?.page?.offset,
      limit: query?.page?.limit,
    };

    const books = await this.bookModel
      .find(filter)
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit);

    return books;
  }

  async findOne(
    filter: string,
    queryDto?: QueryOneBookDto,
  ): Promise<Book | undefined> {
    const query = { $or: [] };
    const { include } = queryDto ?? {};

    if (Types.ObjectId.isValid(filter)) {
      query.$or.push({ _id: filter });
    }
    query.$or.push({ name: filter });
    query.$or.push({ slug: filter });

    const bookQuery = this.bookModel.findOne(query);

    this.populateWithIncludes(bookQuery, include);

    const book = await bookQuery.exec();

    return book?.toObject();
  }

  async delete(id: string): Promise<Book> {
    const book = await this.bookModel.findByIdAndRemove(id);

    return book;
  }

  async update(id: string, dto: PatchBookDto): Promise<Book> {
    const updateData: Partial<Book> = { ...dto };
    if (dto.name) {
      updateData.slug = this.generateSlug(dto.name);
    }

    const updatedBook = await this.bookModel.findOneAndUpdate(
      { _id: id },
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run validations on the update
      },
    );

    if (!updatedBook) {
      throw new NotFoundException('Book not found');
    }

    return updatedBook?.toObject();
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove non-alphanumeric characters, spaces, and hyphens
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
  }

  private populateWithIncludes(query, include: string[]) {
    this.availableFieldsToInclude.forEach((field) => {
      if (include?.includes(field)) {
        query.populate(field);
      }
    });
  }
}
