import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from './MongooseTestModule';
import { MongooseModule } from '@nestjs/mongoose';
import { BookService } from '../src/book/book.service';
import { Book, BookSchema } from '../src/book/schemas/book.schema';
import { ChapterService } from '../src/chapter/chapter.service';
import { Chapter, ChapterSchema } from '../src/chapter/schemas/chapter.schema';
import { Arc, ArcSchema } from '../src/schemas/arc';
import { Scene, SceneSchema } from '../src/schemas/scene';
import { TextFileService } from '../src/text-file/text-file.service';
import mongoose, { Model, Types } from 'mongoose';
import { IsValidObjectIdAndExists } from '../src/shared/validations/validation.objectId-exists';
import { SetValidOrderConstraint } from '../src/shared/validations/validation.order';
import { UniqueTitle } from '../src/shared/validations/validation.title';
import { useContainer } from 'class-validator';
import { ChapterController } from '../src/chapter/chapter.controller';

describe('ChapterController (e2e)', () => {
  let app: INestApplication;
  let service: ChapterService;
  let model: Model<Chapter>;

  // external references
  let bookService: BookService;
  let bookModel: Model<Book>;

  // default values
  let seedBookList: Book[];
  let seedDummyChapter: Chapter;
  const defaultStringFileContent = `conteúdo do capítulo`;
  const defaultBufferFileContent = Buffer.from(defaultStringFileContent);
  const defaultReqFile = {
    fieldname: 'file',
    originalname: 'cap1-zord.txt',
    encoding: '7bit',
    mimetype: 'text/plain',
    buffer: defaultBufferFileContent,
    size: 31281,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        ConfigModule.forRoot(),
        MongooseModule.forFeature([
          { name: Book.name, schema: BookSchema },
          { name: Chapter.name, schema: ChapterSchema },
          { name: Arc.name, schema: ArcSchema },
          { name: Scene.name, schema: SceneSchema },
        ]),
      ],
      controllers: [ChapterController],
      providers: [
        ChapterService,
        TextFileService,
        BookService,
        UniqueTitle,
        IsValidObjectIdAndExists,
        SetValidOrderConstraint,
      ],
    }).compile();

    service = moduleFixture.get<ChapterService>(ChapterService);
    model = moduleFixture.get<Model<Chapter>>('ChapterModel');

    bookService = moduleFixture.get<BookService>(BookService);
    bookModel = moduleFixture.get<Model<Book>>('BookModel');

    // very important line to make the validator work!
    useContainer(moduleFixture, { fallbackOnErrors: true });

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await model.deleteMany({});
    await bookModel.deleteMany({});
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
      bookService.create({
        title: 'Book 0',
      }),
    );

    promise.push(
      bookService.create({
        title: 'Book 1',
      }),
    );

    const [book0, book1] = await Promise.all(promise);

    seedBookList = [book0, book1];

    const dummyChapter = {
      title: 'dummy chapter',
      summary: 'summary of the chapter',
      content: 'content of the chapter',
    };

    seedDummyChapter = await service.createWithText({
      bookId: seedBookList[0]._id.toString(),
      ...dummyChapter,
      title: 'chapter 1',
      order: 1,
    });

    await service.createWithText({
      bookId: seedBookList[0]._id.toString(),
      ...dummyChapter,
      order: 2,
    });
  };

  describe('CrudGetOne', () => {});

  describe('CrudGetAll', () => {});

  describe('CrudPost', () => {
    describe('Create with an formated chapter file', () => {});
    describe('Create with an text', () => {
      it('should create a dummy chapter without order field', async () => {
        const bookId = seedBookList[0]._id.toString();
        const summary = 'summary of the chapter';
        const content = 'content of the chapter';
        const response = await request(app.getHttpServer())
          .post('/chapter')
          .send({
            bookId: bookId,
            title: 'title',
            summary: summary,
            content: content,
          });
        expect(response.status).toBe(201);
        const book = response.body;
        expect(book).toBeDefined();

        const books = (await request(app.getHttpServer()).get('/chapter')).body;
        expect(books).toHaveLength(3);

        const resFindOne = await request(app.getHttpServer())
          .get('/chapter/id')
          .query({ filter: { id: book.id } });
        const chapter = resFindOne.body;

        expect(chapter).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            title: book.title,
            slug: book.slug,
            book: expect.objectContaining({ id: expect.any(String) }),
            arcs: expect.any(Array),
            content: content,
            order: books.length,
            summary: summary,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        );
      });

      it('should create a dummy chapter with custom order', async () => {
        const bookId = seedBookList[0]._id.toString();
        const summary = 'summary of the chapter';
        const content = 'content of the chapter';
        const response = await request(app.getHttpServer())
          .post('/chapter')
          .send({
            bookId: bookId,
            title: 'title',
            summary: summary,
            content: content,
            order: seedBookList.length + 1,
          });
        expect(response.status).toBe(201);
        const book = response.body;
        expect(book).toBeDefined();

        const books = (await request(app.getHttpServer()).get('/chapter')).body;
        expect(books).toHaveLength(3);
      });

      it('should not create a chapter with an order that already exists', async () => {
        const bookId = seedBookList[0]._id.toString();
        const summary = 'summary of the chapter';
        const content = 'content of the chapter';
        const response = await request(app.getHttpServer())
          .post('/chapter')
          .send({
            bookId: bookId,
            title: 'title',
            summary: summary,
            content: content,
            order: seedDummyChapter.order,
          });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual([
          `Chapter order '${seedDummyChapter.order}' must be unique within the book '${bookId}'`,
        ]);
      });

      it('should not create a chapter with a duplicate title', async () => {
        const bookId = seedBookList[0]._id.toString();
        const title = seedDummyChapter.title;
        const summary = 'new summary of the chapter';
        const content = 'new content of the chapter';
        const response = await request(app.getHttpServer())
          .post('/chapter')
          .send({
            bookId: bookId,
            title: title,
            summary: summary,
            content: content,
          });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual([
          `Chapter title '${title}' must be unique within the book '${bookId}'`,
        ]);
      });

      it('should not create a chapter with a non existing book', async () => {
        const bookId = new Types.ObjectId().toString();
        const title = 'new title of the chapter';
        const summary = 'new summary of the chapter';
        const content = 'new content of the chapter';
        const response = await request(app.getHttpServer())
          .post('/chapter')
          .send({
            bookId: bookId,
            title: title,
            summary: summary,
            content: content,
            order: seedBookList.length + 1,
          });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual([
          `Chapter title 'new title of the chapter' must be unique within the book '${bookId}'`,
          `bookId is invalid with value ${bookId}.`,
          `Chapter order '${
            seedBookList.length + 1
          }' must be unique within the book '${bookId}'`,
        ]);
      });
      it('should not create a chapter with a invalid book id', async () => {
        const bookId = 'invalid Id';
        const title = 'new title of the chapter';
        const summary = 'new summary of the chapter';
        const content = 'new content of the chapter';
        const response = await request(app.getHttpServer())
          .post('/chapter')
          .send({
            bookId: bookId,
            title: title,
            summary: summary,
            content: content,
            order: seedBookList.length + 1,
          });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual([
          `bookId is invalid with value ${bookId}.`,
        ]);
      });
    });
  });

  describe('CrudPut', () => {});

  describe('CrudPatch', () => {});

  describe('CrudDelete', () => {});
});
