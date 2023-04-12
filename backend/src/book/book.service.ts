import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { QueryManyBookDto, QueryOneBookDto } from './dto/query.dto';
import { PatchBookDto } from './dto/patch.dto';
import { CreateBookDto } from './dto/create.dto';
import { Book } from './schemas/book.schema';

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

  async findAll(queryDto: QueryManyBookDto): Promise<Book[]> {
    const filter: FilterQuery<Book> = {};

    if (queryDto.filter?.name) {
      filter.name = new RegExp(queryDto.filter.name, 'i'); // Add this line to enable case-insensitive partial matching
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

    const bookQuery = this.bookModel
      .find(filter)
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit);

    if (queryDto.include) {
      this.populateWithIncludes(bookQuery, queryDto.include);
    }

    return bookQuery.exec();
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

    return bookQuery.exec();
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

    return updatedBook;
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
