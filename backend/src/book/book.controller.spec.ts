import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schemas/book.schema';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/MongooseTestModule';
import mongoose, { Model } from 'mongoose';
import { ChapterService } from '../chapter/chapter.service';
import { Chapter, ChapterSchema } from '../chapter/schemas/chapter.schema';
import { Arc, ArcSchema } from '../schemas/arc';
import { Scene, SceneSchema } from '../schemas/scene';
import { TextFileService } from '../chapter/text-file.service';

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;
  let chapterService: ChapterService;
  let bookModel: Model<Book>;
  let chapterModel: Model<Chapter>;

  let seedBookList: Book[];
  let book0Chapter: Chapter;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Book.name, schema: BookSchema },
          { name: Chapter.name, schema: ChapterSchema },
          { name: Arc.name, schema: ArcSchema },
          { name: Scene.name, schema: SceneSchema },
        ]),
      ],
      controllers: [BookController],
      providers: [BookService, ChapterService, TextFileService],
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
    chapterService = module.get<ChapterService>(ChapterService);
    bookModel = module.get<Model<Book>>('BookModel');
    chapterModel = module.get<Model<Chapter>>('ChapterModel');
  });

  beforeEach(async () => {
    await bookModel.deleteMany({});
    await chapterModel.deleteMany({});
    await seedDb();
  });

  afterAll(async () => {
    await closeInMongodConnection();
    mongoose.disconnect();
    mongoose.connection.close();
  });

  const seedDb = async () => {
    const promise = [];
    promise.push(
      service.create({
        title: 'Book 0',
      }),
    );

    promise.push(
      service.create({
        title: 'Book 1',
      }),
    );

    const [book0, book1] = await Promise.all(promise);

    book0Chapter = await chapterService.create({
      title: 'Chapter 1',
      bookId: book0._id,
      content: 'bla bla bla',
    });

    seedBookList = [book0, book1];
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a book', async () => {
    const book = await controller.create({
      title: 'title',
    });
    expect(book).toBeDefined();

    const books = await controller.findAll({});
    expect(books).toHaveLength(3);

    const book2 = await controller.findOne(book.id, {});
    expect(book2).toBeDefined();
    expect(book2.id).toEqual(book.id);
  });

  it('should not create a book with a duplicate name', async () => {
    // Create the first book
    await controller.create({
      title: 'Title',
    });

    // Try to create the second book with the same name and expect a rejection
    await expect(
      controller.create({
        title: 'Title',
      }),
    ).rejects.toThrowError();
  });

  it('should get all books', async () => {
    const books = await controller.findAll({});
    expect(books).toHaveLength(seedBookList.length);
  });

  it('should get a book by id', async () => {
    const book = await controller.findOne(seedBookList[0]._id.toString(), {});
    expect(book).toBeDefined();
    expect(book.id).toEqual(seedBookList[0]._id.toString());
  });

  it('should update a book', async () => {
    const book = await controller.update(seedBookList[0]._id.toString(), {
      title: 'New Name',
    });
    expect(book).toBeDefined();
    expect(book.id).toEqual(seedBookList[0]._id.toString());
    expect(book.title).toEqual('New Name');
    expect(book.slug).toEqual('new-name');

    const book2 = await controller.findOne(book.id, {});
    expect(book2).toBeDefined();
    expect(book2.id).toEqual(book.id);
    expect(book2.title).toEqual('New Name');
    expect(book2.slug).toEqual('new-name');
  });

  it('should delete a book', async () => {
    const book = await controller.remove(seedBookList[0]._id.toString());
    expect(book).toBeDefined();
    expect(book.id).toEqual(seedBookList[0]._id.toString());

    const books = await controller.findAll({});
    expect(books).toHaveLength(seedBookList.length - 1);
  });

  it('should not delete a book that does not exist', async () => {
    await expect(
      controller.remove('5f5f9b9c6b5b1e1c6c5f1b3c'),
    ).rejects.toThrowError();
  });

  it('should not update a book that does not exist', async () => {
    await expect(
      controller.update('5f5f9b9c6b5b1e1c6c5f1b3c', {
        title: 'New Name',
      }),
    ).rejects.toThrowError();
  });

  it('should not get a book by id that does not exist', async () => {
    await expect(
      controller.findOne('5f5f9b9c6b5b1e1c6c5f1b3c', {}),
    ).rejects.toThrowError();
  });

  it('should not create a book with an empty name', async () => {
    await expect(
      controller.create({
        title: '',
      }),
    ).rejects.toThrowError();
  });

  it('should not create a book with a name that is too long', async () => {
    await expect(
      controller.create({
        title: 'a'.repeat(256),
      }),
    ).rejects.toThrowError();
  });

  it('should not update a book with an empty name', async () => {
    await expect(
      controller.update(seedBookList[0]._id.toString(), {
        title: '',
      }),
    ).rejects.toThrowError();
  });

  it('should not update a book with a name that is too long', async () => {
    await expect(
      controller.update(seedBookList[0]._id.toString(), {
        title: 'a'.repeat(256),
      }),
    ).rejects.toThrowError();
  });

  it('should not update a book with a duplicate name', async () => {
    // Create the first book
    await controller.create({
      title: 'Title',
    });

    // Try to update the second book with the same name and expect a rejection
    await expect(
      controller.update(seedBookList[1]._id.toString(), {
        title: 'Title',
      }),
    ).rejects.toThrowError();
  });

  it('should patch a book', async () => {
    const book = await controller.patch(seedBookList[0]._id.toString(), {
      title: 'New Name',
    });
    expect(book).toBeDefined();
    expect(book.id).toEqual(seedBookList[0]._id.toString());
    expect(book.title).toEqual('New Name');
    expect(book.slug).toEqual('new-name');

    const book2 = await controller.findOne(book.id, {});
    expect(book2).toBeDefined();
    expect(book2.id).toEqual(book.id);
    expect(book2.title).toEqual('New Name');
    expect(book2.slug).toEqual('new-name');
  });

  it('should filter partial and case sensitive filter to name when findAll', async () => {
    const books = await controller.findAll({ filter: { title: 'book' } });
    expect(books).toHaveLength(seedBookList.length);
  });

  it('should filter partial and case sensitive filter to slug when findAll', async () => {
    const books = await controller.findAll({ filter: { slug: 'book' } });
    expect(books).toHaveLength(seedBookList.length);
  });

  it('should sort desc by name when findAll ', async () => {
    const books = await controller.findAll({
      page: { limit: 2, offset: 0 },
      sort: ['-name'],
    });
    expect(books).toHaveLength(seedBookList.length);
    expect(books[0].title).toEqual('Book 1');
    expect(books[1].title).toEqual('Book 0');
  });

  it('should sort asc by name when findAll ', async () => {
    const books = await controller.findAll({
      page: { limit: 2, offset: 0 },
      sort: ['name'],
    });
    expect(books).toHaveLength(seedBookList.length);
    expect(books[0].title).toEqual('Book 0');
    expect(books[1].title).toEqual('Book 1');
  });

  it('should include chapter fields when findAll has include param', async () => {
    const books = await controller.findAll({
      include: ['chapters'],
    });
    expect(books).toHaveLength(seedBookList.length);
    // Book 0 have 1 chapter
    expect(books[0].chapters).toHaveLength(1);
    expect(books[0].chapters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: book0Chapter._id,
          title: book0Chapter.title,
          content: book0Chapter.content,
        }),
      ]),
    );

    // Book 1 has no chapters
    expect(books[1].chapters).toHaveLength(0);
  });

  it('should include chapter fields when findOne has include param', async () => {
    const book = await controller.findOne(seedBookList[0]._id.toString(), {
      include: ['chapters'],
    });
    expect(book).toBeDefined();
    expect(book.id).toEqual(seedBookList[0]._id.toString());
    expect(book.chapters).toHaveLength(1);
    expect(book.chapters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: book0Chapter._id,
          title: book0Chapter.title,
          content: book0Chapter.content,
        }),
      ]),
    );
  });

  it('should include only chapter id when findOne has no include param', async () => {
    const book = await controller.findOne(seedBookList[0]._id.toString(), {});
    expect(book).toBeDefined();
    expect(book.id).toEqual(seedBookList[0]._id.toString());
    expect(book.chapters).toHaveLength(1);
    expect(book.chapters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: book0Chapter._id,
        }),
      ]),
    );
  });

  it('should include only chapter id when findAll has no include param', async () => {
    const books = await controller.findAll({});
    expect(books).toHaveLength(seedBookList.length);
    expect(books[0].chapters).toHaveLength(1);
    expect(books[0].chapters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: book0Chapter._id,
        }),
      ]),
    );
  });
});
