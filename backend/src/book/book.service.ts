import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClsService } from 'nestjs-cls';
import { Chapter } from '../chapter/schemas/chapter.schema';
import { IZordContext } from '../interfaces/cls.store';
import { StoryElementCrudService } from '../shared/story-element/story.element.crud.service';
import { generateSlug } from '../shared/story-element/story.element.utils';
import { IBook } from './interfaces/book';
import { Book } from './schemas/book.schema';

/**
 * The BookService class is responsible for managing CRUD operations related to books.
 * This class extends the StoryElementCrudService class, which contains generic CRUD operations logic for story elements.
 */
@Injectable()
export class BookService extends StoryElementCrudService<Book> {
  protected availableFieldsToInclude = ['chapters'];

  constructor(
    @InjectModel(Book.name) private bookModel: Model<Book>,
    private readonly cls: ClsService<IZordContext>,
  ) {
    super(bookModel);
  }

  async addChapter(bookId: string, chapter: Chapter): Promise<Book> {
    let book = await this.getBookFromContext(bookId);
    if (!book || !book.chapters) {
      book = await this.findById(bookId);
    }
    book.chapters.push(chapter);

    return this.update(book);
  }

  async removeChapter(bookId: string, chapter: Chapter): Promise<Book> {
    let book = await this.getBookFromContext(bookId);
    if (!book || !book.chapters) {
      book = await this.findById(bookId);
    }

    book.chapters = book.chapters.filter(
      (c) => c._id.toString() !== chapter._id.toString(),
    );
    return this.update(book);
  }

  async update(book: IBook): Promise<Book> {
    const { id } = book;
    const updateData: IBook = { ...book };
    if (book.title) {
      updateData.slug = generateSlug(book.title);
    }

    const bookUpdated = await this.model.findOneAndUpdate(
      { _id: id },
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run validations on the update
      },
    );

    return bookUpdated;
  }

  /**
   * Find a book by its ID and optionally include related data.
   *
   * @param {string} id - The ID of the book to be fetched.
   * @param {string[]} [include=this.availableFieldsToInclude] - An array of related fields to include in the response (default is to include all available fields).
   * @returns {Promise<Book>} A promise that resolves to the found book with its related data included based on the `include` parameter.
   */
  async findById(id: string, include?: string[]): Promise<Book> {
    const book = await super.findById(id, include);
    // this.cls.set('book', book);
    return book;
  }

  private async getBookFromContext(bookId: string): Promise<Book | null> {
    const contextBook = this.cls.get('book');
    if (contextBook && contextBook._id.toString() === bookId) {
      return contextBook;
    }
    return null;
  }
}
