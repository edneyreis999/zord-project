import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import mongoose, { Model, Types } from 'mongoose';
import { ClsModule } from 'nestjs-cls';
import * as request from 'supertest';
import { BookService } from '../src/book/book.service';
import { Book, BookSchema } from '../src/book/schemas/book.schema';
import { ChapterController } from '../src/chapter/chapter.controller';
import { ChapterService } from '../src/chapter/chapter.service';
import { IChapter } from '../src/chapter/interface/Chapter';
import { Chapter, ChapterSchema } from '../src/chapter/schemas/chapter.schema';
import { Arc, ArcSchema } from '../src/schemas/arc';
import { Scene, SceneSchema } from '../src/schemas/scene';
import { FetchBookByIdPipe } from '../src/shared/pipes/fetch.book.by.id.pipe';
import { FetchChapterByIdPipe } from '../src/shared/pipes/fetch.chapter.by.id.pipe';
import { ValidateUniqueOrderPipe } from '../src/shared/pipes/validate.unique.order.pipe';
import { ValidateUniqueTitlePipe } from '../src/shared/pipes/validate.unique.title.pipe';
import { TextFileService } from '../src/text-file/text-file.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from './MongooseTestModule';

describe('ChapterController (e2e)', () => {
  let app: INestApplication;
  let service: ChapterService;
  let model: Model<Chapter>;

  // external references
  let bookService: BookService;
  let bookModel: Model<Book>;
  // let cls: ClsService<IContext>;

  // default values
  let seedBookList: Book[];
  let seedDummyChapters: Chapter[];

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
        ClsModule.forRoot({
          global: true,
          middleware: {
            mount: true,
            generateId: true,
          },
        }),
      ],
      controllers: [ChapterController],
      providers: [
        ChapterService,
        TextFileService,
        BookService,
        ValidateUniqueTitlePipe,
        ValidateUniqueOrderPipe,
        FetchBookByIdPipe,
        FetchChapterByIdPipe,
      ],
    }).compile();

    service = moduleFixture.get<ChapterService>(ChapterService);
    model = moduleFixture.get<Model<Chapter>>('ChapterModel');

    bookService = moduleFixture.get<BookService>(BookService);
    bookModel = moduleFixture.get<Model<Book>>('BookModel');

    // very important line to make the validator work!
    useContainer(moduleFixture, { fallbackOnErrors: true });

    // Also retrieve the ClsService for later use.
    // cls = moduleFixture.get(ClsService<IContext>);

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
        summary: 'summary of the book',
      }),
    );

    promise.push(
      bookService.create({
        title: 'Book 1',
        summary: 'summary of the book 1',
      }),
    );

    const [book0, book1] = await Promise.all(promise);

    seedBookList = [book0, book1];

    const promiseChapter = [];
    const chapterInput1: IChapter = {
      title: 'Dummy Chapter',
      book: book0,
      summary: 'summary of the chapter',
      content: 'content of the chapter',
      order: 1,
    };
    promiseChapter.push(service.create(chapterInput1));

    const chapterInput2: IChapter = {
      title: 'Dummy Chapter 2',
      book: book0,
      summary: 'summary of the chapter',
      content: 'content of the chapter',
      order: 2,
    };

    promiseChapter.push(service.create(chapterInput2));

    await Promise.all(promiseChapter).then((chapters) => {
      seedDummyChapters = chapters;
    });
  };

  describe('Chapter module', () => {
    describe('CrudGetOne', () => {
      it('should get a chapter by id', async () => {
        const chapterId = seedDummyChapters[0]._id.toString();
        const response = await request(app.getHttpServer())
          .get(`/chapter/id`)
          .query({
            filter: {
              id: chapterId,
            },
          });
        expect(response.status).toBe(200);
        const chapter = response.body;
        expect(chapter).toHaveProperty('title', seedDummyChapters[0].title);
      });
      it('should not get a chapter with wrong id', async () => {
        const chapterId = new Types.ObjectId().toString();
        const response = await request(app.getHttpServer())
          .get(`/chapter/id`)
          .query({
            filter: {
              id: chapterId,
            },
          });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          statusCode: 404,
          message: `Chapter with id ${chapterId} not found`,
          error: 'Not Found',
        });
      });
      it('should thorw an error if id is not a valid ObjectId', async () => {
        const chapterId = '123';
        const response = await request(app.getHttpServer())
          .get(`/chapter/id`)
          .query({
            filter: {
              id: chapterId,
            },
          });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['filter.id invalid'],
          error: 'Bad Request',
        });
      });
      it('should throw an error if id is not provided', async () => {
        const response = await request(app.getHttpServer())
          .get(`/chapter/id`)
          .query({
            filter: {
              title: 'dummy chapter',
            },
          });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: [
            'filter.id should not be null or undefined',
            'filter.id invalid',
            'filter.id must be a string',
          ],
          error: 'Bad Request',
        });
      });
      it('should throw an error if filter is not provided', async () => {
        const response = await request(app.getHttpServer()).get(`/chapter/id`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['filter should not be null or undefined'],
          error: 'Bad Request',
        });
      });
      it('should include book fields when findOne has include param', async () => {
        const chapterId = seedDummyChapters[0]._id.toString();
        const response = await request(app.getHttpServer())
          .get(`/chapter/id`)
          .query({
            filter: {
              id: chapterId,
            },
            include: ['book'],
          });
        expect(response.status).toBe(200);
        const chapter = response.body;
        expect(chapter).toHaveProperty('title', seedDummyChapters[0].title);
        expect(chapter).toHaveProperty('book');
        expect(chapter.book).toHaveProperty('title', seedBookList[0].title);
        expect(chapter.book).toHaveProperty('summary', seedBookList[0].summary);
      });
    });

    describe('CrudGetAll', () => {
      it('should get all chapters from a book', async () => {
        const bookId = seedBookList[0]._id.toString();
        const response = await request(app.getHttpServer())
          .get(`/chapter`)
          .query({
            filter: {
              bookId: bookId,
            },
          });
        expect(response.status).toBe(200);
        const chapters = response.body;
        expect(chapters).toHaveLength(2);
        expect(chapters).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              title: seedDummyChapters[0].title,
            }),
            expect.objectContaining({
              title: seedDummyChapters[1].title,
            }),
          ]),
        );
      });
      it('should not get chapters without filter in query string', async () => {
        const response = await request(app.getHttpServer())
          .get(`/chapter`)
          .query({});
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            message: ['filter should not be null or undefined'],
            error: 'Bad Request',
          }),
        );
      });
      it('should not get chapters when bookId is invalid', async () => {
        const response = await request(app.getHttpServer())
          .get(`/chapter`)
          .query({
            filter: {
              bookId: 'invalidBookId',
            },
          });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            message: ['filter.bookId invalid'],
            error: 'Bad Request',
          }),
        );
      });
      it('should not get chapters when bookId not exists', async () => {
        const response = await request(app.getHttpServer())
          .get(`/chapter`)
          .query({
            filter: {
              bookId: new mongoose.Types.ObjectId().toString(),
            },
          });
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });
      it('should not get chapters when filter has no bookId', async () => {
        const response = await request(app.getHttpServer())
          .get(`/chapter`)
          .query({
            filter: {
              title: 'dummy chapter',
            },
          });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            message: [
              'filter.bookId should not be null or undefined',
              'filter.bookId invalid',
              'filter.bookId must be a string',
            ],
            error: 'Bad Request',
          }),
        );
      });
      it('should filter partial and case-sensitive when filtering chapters by title', async () => {
        const bookId = seedBookList[0]._id.toString();
        const response = await request(app.getHttpServer())
          .get(`/chapter`)
          .query({
            filter: {
              bookId: bookId,
              title: 'dummy',
            },
          });
        expect(response.status).toBe(200);
        const chapters = response.body;
        expect(chapters).toHaveLength(2);
        expect(chapters).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              title: seedDummyChapters[0].title,
            }),
            expect.objectContaining({
              title: seedDummyChapters[1].title,
            }),
          ]),
        );
      });
      it('should filter partial and case-sensitive when filtering chapter by slug', async () => {
        const bookId = seedBookList[0]._id.toString();
        const response = await request(app.getHttpServer())
          .get(`/chapter`)
          .query({
            filter: {
              bookId: bookId,
              slug: 'dummy-chapter',
            },
          });
        expect(response.status).toBe(200);
        const chapters = response.body;
        expect(chapters).toHaveLength(2);
        expect(chapters).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              title: seedDummyChapters[0].title,
            }),
            expect.objectContaining({
              title: seedDummyChapters[1].title,
            }),
          ]),
        );
      });
      it('should sort desc chapter by title ', async () => {
        const bookId = seedBookList[0]._id.toString();
        const response = await request(app.getHttpServer())
          .get(`/chapter`)
          .query({
            filter: {
              bookId: bookId,
            },
            sort: ['-title'],
          });
        expect(response.status).toBe(200);
        const chapters = response.body;
        expect(chapters).toHaveLength(2);
        expect(chapters).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              title: seedDummyChapters[1].title,
            }),
            expect.objectContaining({
              title: seedDummyChapters[0].title,
            }),
          ]),
        );
      });
      it('should sort asc chapter by title ', async () => {
        const bookId = seedBookList[0]._id.toString();
        const response = await request(app.getHttpServer())
          .get(`/chapter`)
          .query({
            filter: {
              bookId: bookId,
            },
            sort: ['title'],
          });
        expect(response.status).toBe(200);
        const chapters = response.body;
        expect(chapters).toHaveLength(2);
        expect(chapters).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              title: seedDummyChapters[0].title,
            }),
            expect.objectContaining({
              title: seedDummyChapters[1].title,
            }),
          ]),
        );
      });
      it('should throw error when the sort field was not foreseen', async () => {
        const bookId = seedBookList[0]._id.toString();
        const response = await request(app.getHttpServer())
          .get(`/chapter`)
          .query({
            filter: {
              bookId: bookId,
            },
            sort: ['-invalidField'],
          });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            message: [
              'each value in sort must be one of the following values: title, -title, createdAt, -createdAt',
            ],
            error: 'Bad Request',
          }),
        );
      });
      it('should filter by chapter id when findAll ', async () => {
        const bookId = seedBookList[0]._id.toString();
        const chapterId = seedDummyChapters[0]._id.toString();
        const response = await request(app.getHttpServer())
          .get(`/chapter`)
          .query({
            filter: {
              bookId: bookId,
              id: chapterId,
            },
          });
        expect(response.status).toBe(200);
        const chapters = response.body;
        expect(chapters).toHaveLength(1);
        expect(chapters).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              title: seedDummyChapters[0].title,
            }),
          ]),
        );
      });
      it('should throw an error when trying to findAll with an invalid chapter id', async () => {
        const bookId = seedBookList[0]._id.toString();
        const response = await request(app.getHttpServer())
          .get(`/chapter`)
          .query({
            filter: {
              bookId: bookId,
              id: 'invalidId',
            },
          });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            message: ['filter.id invalid'],
            error: 'Bad Request',
          }),
        );
      });
      it('should findAll paginate data', async () => {
        const bookId = seedBookList[0]._id.toString();
        const response = await request(app.getHttpServer())
          .get(`/chapter`)
          .query({
            filter: {
              bookId: bookId,
            },
            sort: ['title'],
            page: {
              limit: 1,
              offset: 0,
            },
          });
        expect(response.status).toBe(200);
        const chapters = response.body;
        expect(chapters).toHaveLength(1);
        expect(chapters).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              title: seedDummyChapters[0].title,
            }),
          ]),
        );
      });
      it('should use default values for offset and limit when not provided', async () => {
        const bookId = seedBookList[0]._id.toString();
        const response = await request(app.getHttpServer())
          .get(`/chapter`)
          .query({
            filter: {
              bookId: bookId,
            },
            sort: ['title'],
          });
        expect(response.status).toBe(200);
        const chapters = response.body;
        expect(chapters).toHaveLength(2);
        expect(chapters).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              title: seedDummyChapters[0].title,
            }),
            expect.objectContaining({
              title: seedDummyChapters[1].title,
            }),
          ]),
        );
      });
    });

    describe('CrudPost', () => {
      describe('Create with an formated chapter file', () => {
        it('should create a dummy chapter with a file and order field', async () => {
          const bookId = seedBookList[0]._id.toString();
          const summary = 'summary of the chapter';
          const customOrder = 3;
          const response = await request(app.getHttpServer())
            .post('/chapter/file')
            .field('bookId', bookId)
            .field('title', 'title')
            .field('summary', summary)
            .field('order', customOrder)
            .attach('file', './test/resources/cap1-complete.txt');
          expect(response.status).toBe(201);
          const createdChapter = response.body;
          expect(createdChapter).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              title: createdChapter.title,
              slug: createdChapter.slug,
              book: expect.objectContaining({ id: expect.any(String) }),
              arcs: expect.arrayContaining([
                expect.any(String),
                expect.any(String),
                expect.any(String),
              ]),
              content: expect.any(String),
              order: customOrder,
              summary: summary,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          );
        });
        it('should create a dummy chapter with a file without order field', async () => {
          const bookId = seedBookList[0]._id.toString();
          const summary = 'summary of the chapter';
          const response = await request(app.getHttpServer())
            .post('/chapter/file')
            .field('bookId', bookId)
            .field('title', 'title')
            .field('summary', summary)
            .attach('file', './test/resources/cap1-complete.txt');
          expect(response.status).toBe(201);
          const createdChapter = response.body;
          expect(createdChapter).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              title: createdChapter.title,
              slug: createdChapter.slug,
              book: expect.objectContaining({ id: expect.any(String) }),
              arcs: expect.arrayContaining([
                expect.any(String),
                expect.any(String),
                expect.any(String),
              ]),
              content: expect.any(String),
              order: seedDummyChapters.length + 1,
              summary: summary,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          );
        });
        it('should not create a chapter without bookId', async () => {
          const response = await request(app.getHttpServer())
            .post('/chapter/file')
            .field('title', 'title')
            .attach('file', './test/resources/cap1-complete.txt');
          expect(response.status).toBe(400);
          expect(response.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: expect.arrayContaining(['bookId should not be empty']),
              error: 'Bad Request',
            }),
          );
        });
        it('should not create a chapter with an empty title', async () => {
          const bookId = seedBookList[0]._id.toString();
          const response = await request(app.getHttpServer())
            .post('/chapter/file')
            .field('bookId', bookId)
            .field('title', '')
            .attach('file', './test/resources/cap1-complete.txt');
          expect(response.status).toBe(400);
          expect(response.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: expect.arrayContaining(['title should not be empty']),
              error: 'Bad Request',
            }),
          );
        });
        it('should create a chapter with arcs and scenes', async () => {
          // TODO - still need to test creation of scenes and arcs
          const bookId = seedBookList[0]._id.toString();
          const summary = 'summary of the chapter';
          const customOrder = 3;
          const response = await request(app.getHttpServer())
            .post('/chapter/file')
            .field('bookId', bookId)
            .field('title', 'title')
            .field('summary', summary)
            .field('order', customOrder)
            .attach('file', './test/resources/cap1-complete.txt');
          expect(response.status).toBe(201);
          const createdChapter = response.body;
          expect(createdChapter).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              title: createdChapter.title,
              slug: createdChapter.slug,
              book: expect.objectContaining({ id: expect.any(String) }),
              arcs: expect.arrayContaining([expect.any(String)]),
              content: expect.any(String),
              order: customOrder,
              summary: summary,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          );
        });
      });
      describe('Create with an text', () => {
        it('should create a dummy chapter with order field', async () => {
          const bookId = seedBookList[0]._id.toString();
          const summary = 'summary of the chapter';
          const content = 'content of the chapter';
          const customOrder = 3;
          const response = await request(app.getHttpServer())
            .post('/chapter')
            .send({
              bookId: bookId,
              title: 'title',
              summary: summary,
              content: content,
              order: customOrder + '',
            });
          expect(response.status).toBe(201);
          const createdChapter = response.body;
          expect(createdChapter).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              title: createdChapter.title,
              slug: createdChapter.slug,
              book: expect.objectContaining({ id: expect.any(String) }),
              arcs: expect.any(Array),
              content: content,
              order: customOrder,
              summary: summary,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          );
        });
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
          const createdChapter = response.body;
          expect(createdChapter).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              title: createdChapter.title,
              slug: createdChapter.slug,
              book: expect.objectContaining({ id: expect.any(String) }),
              arcs: expect.any(Array),
              content: content,
              order: seedBookList[0].chapters.length + 1,
              summary: summary,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          );
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
              order: seedBookList.length + 1 + '',
            });
          expect(response.status).toBe(404);
          expect(response.body.message).toEqual(
            `Book with id ${bookId} not found.`,
          );
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
              order: `${seedBookList.length + 1}`,
            });
          expect(response.status).toBe(400);
          expect(response.body.message).toEqual(['book id invalid']);
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
              order: seedDummyChapters[0].order + '',
            });
          expect(response.status).toBe(400);
          expect(response.body.message).toEqual(
            `Chapter order '${seedDummyChapters[0].order}' need to be unique for book`,
          );
        });
        it('should not create a chapter with a duplicate title', async () => {
          const bookId = seedBookList[0]._id.toString();
          const title = seedDummyChapters[0].title;
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
          expect(response.body.message).toEqual(
            `Chapter title '${title}' need to be unique for book`,
          );
        });
        it('should not create a chapter with a title that is too long', async () => {
          const bookId = seedBookList[0]._id.toString();
          const title = 'a'.repeat(256);
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
            `title must be shorter than or equal to 50 characters`,
          ]);
        });
      });
    });

    describe('CrudPut', () => {
      it('should update a chapter', async () => {
        const chapterId = seedDummyChapters[0]._id.toString();
        const bookId = seedBookList[0]._id.toString();
        const title = 'new title of the chapter';
        const summary = 'new summary of the chapter';
        const content = 'new content of the chapter';
        const response = await request(app.getHttpServer())
          .put(`/chapter`)
          .send({
            id: chapterId,
            title: title,
            summary: summary,
            content: content,
          });
        expect(response.status).toBe(200);
        const updatedChapter = response.body;
        expect(updatedChapter).toEqual(
          expect.objectContaining({
            id: chapterId,
            title: title,
            slug: updatedChapter.slug,
            book: expect.objectContaining({ id: bookId }),
            arcs: expect.any(Array),
            content: content,
            order: seedDummyChapters[0].order,
            summary: summary,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        );
      });
      it('should not update a chapter without id in body', async () => {
        const title = 'new title of the chapter';
        const summary = 'new summary of the chapter';
        const content = 'new content of the chapter';
        const response = await request(app.getHttpServer())
          .put(`/chapter`)
          .send({
            title: title,
            summary: summary,
            content: content,
          });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual([
          'id should not be null or undefined',
          'id invalid',
          'id must be a string',
        ]);
      });
      it('should not update a chapter with a non existing chapter', async () => {
        const chapterId = new Types.ObjectId().toString();
        const title = 'new title of the chapter';
        const summary = 'new summary of the chapter';
        const content = 'new content of the chapter';
        const response = await request(app.getHttpServer())
          .put(`/chapter`)
          .send({
            id: chapterId,
            title: title,
            summary: summary,
            content: content,
          });
        expect(response.status).toBe(404);
        expect(response.body.message).toEqual(
          `Chapter with id ${chapterId} not found.`,
        );
      });
      it('should not update chapter book id', async () => {
        const chapterId = seedDummyChapters[0]._id.toString();
        const bookId = seedBookList[1]._id.toString();
        const title = 'new title of the chapter';
        const summary = 'new summary of the chapter';
        const content = 'new content of the chapter';
        const response = await request(app.getHttpServer())
          .put(`/chapter`)
          .send({
            id: chapterId,
            bookId: bookId,
            title: title,
            summary: summary,
            content: content,
          });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual([
          'property bookId should not exist',
        ]);
      });
      it('should not update a chapter with a invalid chapter id', async () => {
        const chapterId = 'invalid Id';
        const title = 'new title of the chapter';
        const summary = 'new summary of the chapter';
        const content = 'new content of the chapter';
        const response = await request(app.getHttpServer())
          .put(`/chapter`)
          .send({
            id: chapterId,
            title: title,
            summary: summary,
            content: content,
          });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(['id invalid']);
      });
      it('should not update a chapter with an order that already exists', async () => {
        const chapterId = seedDummyChapters[0]._id.toString();
        const summary = 'summary of the chapter';
        const content = 'content of the chapter';
        const response = await request(app.getHttpServer())
          .put(`/chapter`)
          .send({
            id: chapterId,
            title: 'title',
            summary: summary,
            content: content,
            order: seedDummyChapters[1].order + '',
          });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(
          `Chapter order '${seedDummyChapters[1].order}' need to be unique for book`,
        );
      });
      it('should not update a chapter with a duplicate title', async () => {
        const chapterId = seedDummyChapters[0]._id.toString();
        const title = seedDummyChapters[1].title;
        const summary = 'new summary of the chapter';
        const content = 'new content of the chapter';
        const response = await request(app.getHttpServer())
          .put(`/chapter`)
          .send({
            id: chapterId,
            title: title,
            summary: summary,
            content: content,
          });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(
          `Chapter title '${title}' need to be unique for book`,
        );
      });
    });

    describe('CrudPatch', () => {
      it('should patch a chapter title', async () => {
        const chapterId = seedDummyChapters[0]._id.toString();
        const title = 'new title of the chapter';
        const response = await request(app.getHttpServer())
          .patch(`/chapter`)
          .send({
            id: chapterId,
            title: title,
          });
        expect(response.status).toBe(200);
        const updatedChapter = response.body;
        expect(updatedChapter).toEqual(
          expect.objectContaining({
            id: chapterId,
            title: title,
            slug: expect.stringMatching(/new-title-of-the-chapter/),
            book: expect.objectContaining({
              id: seedBookList[0]._id.toString(),
            }),
            arcs: expect.any(Array),
            content: seedDummyChapters[0].content,
            order: seedDummyChapters[0].order,
            summary: seedDummyChapters[0].summary,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        );
      });
      it('should patch a chapter order', async () => {
        const chapterId = seedDummyChapters[0]._id.toString();
        const order = 100;
        const response = await request(app.getHttpServer())
          .patch(`/chapter`)
          .send({
            id: chapterId,
            order: order + '',
          });
        expect(response.status).toBe(200);
        const updatedChapter = response.body;
        expect(updatedChapter).toEqual(
          expect.objectContaining({
            id: chapterId,
            title: seedDummyChapters[0].title,
            slug: seedDummyChapters[0].slug,
            book: expect.objectContaining({
              id: seedBookList[0]._id.toString(),
            }),
            arcs: expect.any(Array),
            content: seedDummyChapters[0].content,
            order: order,
            summary: seedDummyChapters[0].summary,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        );
      });
      it('should not patch an chapter with an empty title', async () => {
        const chapterId = seedDummyChapters[0]._id.toString();
        const title = '';
        const response = await request(app.getHttpServer())
          .patch(`/chapter`)
          .send({
            id: chapterId,
            title: title,
          });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(['title should not be empty']);
      });
      it('should not patch a chapter without id in body', async () => {
        const title = 'new title of the chapter';
        const response = await request(app.getHttpServer())
          .patch(`/chapter`)
          .send({
            title: title,
          });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual([
          'id should not be null or undefined',
          'id invalid',
          'id must be a string',
        ]);
      });
      it('should not patch a chapter with a non existing chapter', async () => {
        const chapterId = new Types.ObjectId().toString();
        const title = 'new title of the chapter';
        const response = await request(app.getHttpServer())
          .patch(`/chapter`)
          .send({
            id: chapterId,
            title: title,
          });
        expect(response.status).toBe(404);
        expect(response.body.message).toEqual(
          `Chapter with id ${chapterId} not found.`,
        );
      });
      it('should not patch chapter book id', async () => {
        const chapterId = seedDummyChapters[0]._id.toString();
        const bookId = new Types.ObjectId().toString();
        const response = await request(app.getHttpServer())
          .patch(`/chapter`)
          .send({
            id: chapterId,
            bookId: bookId,
          });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual([
          'property bookId should not exist',
        ]);
      });
      it('should not patch a chapter with a invalid chapter id', async () => {
        const chapterId = 'invalid id';
        const title = 'new title of the chapter';
        const response = await request(app.getHttpServer())
          .patch(`/chapter`)
          .send({
            id: chapterId,
            title: title,
          });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(['id invalid']);
      });
      it('should not patch a chapter with an order that already exists', async () => {
        const chapterId = seedDummyChapters[0]._id.toString();
        const order = seedDummyChapters[1].order;
        const response = await request(app.getHttpServer())
          .patch(`/chapter`)
          .send({
            id: chapterId,
            order: order + '',
          });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(
          `Chapter order '${order}' need to be unique for book`,
        );
      });
      it('should not patch a chapter with a duplicate title', async () => {
        const chapterId = seedDummyChapters[0]._id.toString();
        const title = seedDummyChapters[1].title;
        const response = await request(app.getHttpServer())
          .patch(`/chapter`)
          .send({
            id: chapterId,
            title: title,
          });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(
          `Chapter title '${title}' need to be unique for book`,
        );
      });
      it('should not patch a chapter title that is too long', async () => {
        const chapterId = seedDummyChapters[0]._id.toString();
        const title = 'a'.repeat(56);
        const response = await request(app.getHttpServer())
          .patch(`/chapter`)
          .send({
            id: chapterId,
            title: title,
          });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual([
          `title must be shorter than or equal to 50 characters`,
        ]);
      });
    });

    describe('CrudDelete', () => {
      it('should delete the chapter', async () => {
        const chapterId = seedDummyChapters[0]._id.toString();
        const response = await request(app.getHttpServer())
          .delete(`/chapter`)
          .query({
            filter: {
              id: chapterId,
            },
          });
        expect(response.status).toBe(204);
        expect(response.body).toEqual({});

        const ownerBook = await bookService.findById(
          seedDummyChapters[0].book._id.toString(),
        );
        expect(ownerBook.chapters).toHaveLength(seedDummyChapters.length - 1);
      });
      it('should throw an error if the chapter does not exist', async () => {
        const chapterId = new Types.ObjectId().toString();
        const response = await request(app.getHttpServer())
          .delete(`/chapter`)
          .query({
            filter: {
              id: chapterId,
            },
          });
        expect(response.status).toBe(404);
        expect(response.body.message).toEqual(
          `Chapter with id ${chapterId} not found`,
        );

        const ownerBook = await bookService.findById(
          seedDummyChapters[0].book._id.toString(),
        );
        expect(ownerBook.chapters).toHaveLength(seedDummyChapters.length);
      });
      it('should throw an error if the chapter id is invalid', async () => {
        const chapterId = 'invalid id';
        const response = await request(app.getHttpServer())
          .delete(`/chapter`)
          .query({
            filter: {
              id: chapterId,
            },
          });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(['filter.id invalid']);
      });
      it('should throw an error if the chapter id is not provided', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/chapter`)
          .query({
            filter: {
              title: 'title',
            },
          });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual([
          'filter.id should not be null or undefined',
          'filter.id invalid',
          'filter.id must be a string',
        ]);
      });
      it('should throw an error if filter is not provided', async () => {
        const response = await request(app.getHttpServer()).delete(`/chapter`);
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual([
          'filter should not be null or undefined',
        ]);
      });
    });
  });
});
