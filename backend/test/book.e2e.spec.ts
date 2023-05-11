import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import { Model, Types } from 'mongoose';
import { ClsModule } from 'nestjs-cls';
import * as request from 'supertest';
import { Arc, ArcSchema } from '../src/arc/schemas/arc';
import { BookController } from '../src/book/book.controller';
import { BookService } from '../src/book/book.service';
import { Book, BookSchema } from '../src/book/schemas/book.schema';
import { ChapterService } from '../src/chapter/chapter.service';
import { IChapter } from '../src/chapter/interface/Chapter';
import { Chapter, ChapterSchema } from '../src/chapter/schemas/chapter.schema';
import { SceneService } from '../src/scene/scene.service';
import { Scene, SceneSchema } from '../src/scene/schemas/scene.schema';
import { FetchBookByIdPipe } from '../src/shared/pipes/fetch.book.by.id.pipe';
import { TextFileService } from '../src/text-file/text-file.service';
import { rootMongooseTestModule } from './MongooseTestModule';

describe('BookController (e2e)', () => {
  let app: INestApplication;
  let service: BookService;
  let chapterService: ChapterService;
  let bookModel: Model<Book>;
  let chapterModel: Model<Chapter>;

  let seedBookList: Book[];
  let seedBookWithChapters: Book;
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
      controllers: [BookController],
      providers: [
        ChapterService,
        TextFileService,
        BookService,
        FetchBookByIdPipe,
        SceneService,
      ],
    }).compile();
    service = moduleFixture.get<BookService>(BookService);
    chapterService = moduleFixture.get<ChapterService>(ChapterService);
    bookModel = moduleFixture.get<Model<Book>>('BookModel');
    chapterModel = moduleFixture.get<Model<Chapter>>('ChapterModel');

    // very important line to make the validator work!
    useContainer(moduleFixture, { fallbackOnErrors: true });

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await bookModel.deleteMany({});
    await chapterModel.deleteMany({});
    await seedDb();
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
    seedBookWithChapters = book0;
    seedBookList = [book0, book1];

    const promiseChapter = [];
    const chapterInput1: IChapter = {
      title: 'Dummy Chapter',
      book: seedBookWithChapters,
      summary: 'summary of the chapter',
      content: 'content of the chapter',
      order: 1,
    };
    promiseChapter.push();

    const chapter1 = await chapterService.create(chapterInput1);

    const chapterInput2: IChapter = {
      title: 'Dummy Chapter 2',
      book: seedBookWithChapters,
      summary: 'summary of the chapter',
      content: 'content of the chapter',
      order: 2,
    };

    const chapter2 = await chapterService.create(chapterInput2);

    seedDummyChapters = [chapter1, chapter2];
  };

  describe('Book Module (e2e)', () => {
    describe('CrudGetOne', () => {
      it('should get a book by id', async () => {
        const resFindOne = await request(app.getHttpServer())
          .get(`/book/id`)
          .query({
            filter: {
              id: seedBookWithChapters._id.toString(),
            },
          });
        expect(resFindOne.status).toBe(200);
        const book = resFindOne.body;
        expect(book.id).toEqual(seedBookWithChapters._id.toString());
        expect(book).toEqual(
          expect.objectContaining({
            chapters: expect.arrayContaining([]),
            createdAt: expect.any(String),
            id: expect.any(String),
            slug: seedBookWithChapters.slug,
            title: seedBookWithChapters.title,
            updatedAt: expect.any(String),
          }),
        );
      });
      it('should not get a book by id that does not exist', async () => {
        const randomId = new Types.ObjectId().toString();
        const resFindOne = await request(app.getHttpServer())
          .get(`/book/id`)
          .query({
            filter: {
              id: randomId,
            },
          });
        expect(resFindOne.status).toBe(404);
        expect(resFindOne.body.message).toEqual(
          `Book with id ${randomId} not found`,
        );
      });
      it('should throw error when id is not a valid ObjectId', async () => {
        const wrongId = '123';
        const response = await request(app.getHttpServer())
          .get('/book/id')
          .query({
            filter: {
              id: wrongId,
            },
          });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: [`filter.id invalid`],
          error: 'Bad Request',
        });
      });
      it('should throw an error when id is not provided', async () => {
        const response = await request(app.getHttpServer())
          .get('/book/id')
          .query({
            filter: { title: 'dummy' },
          });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: [
            'filter.property title should not exist',
            'filter.id should not be null or undefined',
            'filter.id invalid',
            'filter.id must be a string',
          ],
          error: 'Bad Request',
        });
      });
      it('should throw an error when filter is not provided', async () => {
        const response = await request(app.getHttpServer()).get('/book/id');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['filter should not be null or undefined'],
          error: 'Bad Request',
        });
      });
      it('should include all chapters fields when findOne has chapters in include param', async () => {
        const response = await request(app.getHttpServer())
          .get('/book/id')
          .query({
            filter: {
              id: seedBookWithChapters._id.toString(),
            },
            include: ['chapters'],
          });
        expect(response.status).toBe(200);
        const book = response.body;
        expect(book.chapters).toHaveLength(seedDummyChapters.length);
        expect(book).toEqual(
          expect.objectContaining({
            chapters: expect.arrayContaining([
              expect.objectContaining({
                createdAt: expect.any(String),
                id: expect.any(String),
                slug: expect.any(String),
                title: expect.any(String),
                updatedAt: expect.any(String),
              }),
            ]),
            createdAt: expect.any(String),
            id: expect.any(String),
            slug: seedBookWithChapters.slug,
            title: seedBookWithChapters.title,
            updatedAt: expect.any(String),
          }),
        );
      });
      it('should return an array of chapters ids when findOne has no include param', async () => {
        const response = await request(app.getHttpServer())
          .get('/book/id')
          .query({
            filter: {
              id: seedBookWithChapters._id.toString(),
            },
          });
        expect(response.status).toBe(200);
        const book = response.body;
        expect(book).toEqual(
          expect.objectContaining({
            chapters: expect.arrayContaining([
              expect.objectContaining({ id: expect.any(String) }),
            ]),
            createdAt: expect.any(String),
            id: expect.any(String),
            slug: seedBookWithChapters.slug,
            title: seedBookWithChapters.title,
            updatedAt: expect.any(String),
          }),
        );
      });
      it('should throw an error when include param is not expected', async () => {
        const response = await request(app.getHttpServer())
          .get('/book/id')
          .query({
            filter: {
              id: seedBookWithChapters._id.toString(),
            },
            include: ['wrong'],
          });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: [
            'each value in include must be one of the following values: chapters',
          ],
          error: 'Bad Request',
        });
      });
    });

    describe('CrudGetAll', () => {
      it('should get all books', async () => {
        const response = await request(app.getHttpServer())
          .get('/book')
          .query({
            filter: {
              title: 'book',
            },
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(seedBookList.length);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              chapters: expect.arrayContaining([
                expect.objectContaining({ id: expect.any(String) }),
              ]),
              createdAt: expect.any(String),
              id: expect.any(String),
              slug: seedBookList[0].slug,
              title: seedBookList[0].title,
              updatedAt: expect.any(String),
            }),
            expect.objectContaining({
              chapters: expect.arrayContaining([]),
              createdAt: expect.any(String),
              id: expect.any(String),
              slug: seedBookList[1].slug,
              title: seedBookList[1].title,
              updatedAt: expect.any(String),
            }),
          ]),
        );
      });

      it('should throw an error when filter has an unexpected field', async () => {
        const response = await request(app.getHttpServer())
          .get('/book')
          .query({
            filter: {
              banana: '',
            },
          });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['filter.property banana should not exist'],
          error: 'Bad Request',
        });
      });

      it('should not get books without filter in query string', async () => {
        const response = await request(app.getHttpServer()).get('/book');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['filter should not be null or undefined'],
          error: 'Bad Request',
        });
      });

      it('should filter partial and case-sensitive when filtering chapters by title', async () => {
        const response = await request(app.getHttpServer())
          .get('/book')
          .query({ filter: { title: 'book' } });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
      });

      it('should filter partial and case-sensitive when filtering chapter by slug', async () => {
        const response = await request(app.getHttpServer())
          .get('/book')
          .query({ filter: { slug: 'book' } });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
      });

      it('should sort desc chapter by title', async () => {
        const response = await request(app.getHttpServer())
          .get('/book')
          .query({
            filter: {
              title: 'book',
            },
            page: { limit: 2, offset: 0 },
            sort: ['-title'],
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(seedBookList.length);
        expect(response.body[0].title).toBe('Book 1');
        expect(response.body[1].title).toBe('Book 0');
      });

      it('should sort asc chapter by title', async () => {
        const response = await request(app.getHttpServer())
          .get('/book')
          .query({
            filter: {
              title: 'book',
            },
            page: { limit: 2, offset: 0 },
            sort: ['title'],
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(seedBookList.length);
        expect(response.body[0].title).toBe('Book 0');
        expect(response.body[1].title).toBe('Book 1');
      });

      it('should throw error when the sort field was not expected', async () => {
        const response = await request(app.getHttpServer())
          .get('/book')
          .query({
            filter: {
              title: 'book',
            },
            page: { limit: 2, offset: 0 },
            sort: ['wrong'],
          });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: [
            'each value in sort must be one of the following values: title, -title, createdAt, -createdAt',
          ],
          error: 'Bad Request',
        });
      });

      it('should filter by book id when findAll ', async () => {
        const bookId = seedBookList[0]._id.toString();
        const response = await request(app.getHttpServer())
          .get('/book')
          .query({
            filter: {
              id: bookId,
            },
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              chapters: expect.arrayContaining([
                expect.objectContaining({ id: expect.any(String) }),
              ]),
              createdAt: expect.any(String),
              id: expect.any(String),
              slug: seedBookList[0].slug,
              title: seedBookList[0].title,
              updatedAt: expect.any(String),
            }),
          ]),
        );
      });

      it('should throw an error when trying to findAll with an invalid book id', async () => {
        const response = await request(app.getHttpServer())
          .get('/book')
          .query({
            filter: {
              id: 'wrong',
            },
          });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['filter.id invalid'],
          error: 'Bad Request',
        });
      });

      it('should findAll paginate data', async () => {
        const response = await request(app.getHttpServer())
          .get('/book')
          .query({
            filter: {
              title: 'book',
            },
            page: { limit: 1, offset: 0 },
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);

        const response2 = await request(app.getHttpServer())
          .get('/book')
          .query({
            filter: {
              title: 'book',
            },
            page: { limit: 1, offset: 1 },
          });

        expect(response2.status).toBe(200);
        expect(response2.body).toHaveLength(1);
      });

      it('should use default values for offset and limit when not provided', async () => {
        const response = await request(app.getHttpServer())
          .get('/book')
          .query({
            filter: {
              title: 'book',
            },
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
      });

      it('should include chapter fields when findAll has include chapters param', async () => {
        const response = await request(app.getHttpServer())
          .get('/book')
          .query({
            filter: {
              title: 'book',
            },
            include: ['chapters'],
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(seedBookList.length);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              chapters: expect.arrayContaining([
                expect.objectContaining({
                  content: expect.any(String),
                  createdAt: expect.any(String),
                  id: expect.any(String),
                  title: expect.any(String),
                  updatedAt: expect.any(String),
                }),
              ]),
              createdAt: expect.any(String),
              id: expect.any(String),
              slug: seedBookList[0].slug,
              title: seedBookList[0].title,
              updatedAt: expect.any(String),
            }),
            expect.objectContaining({
              chapters: expect.arrayContaining([]),
              createdAt: expect.any(String),
              id: expect.any(String),
              slug: seedBookList[1].slug,
              title: seedBookList[1].title,
              updatedAt: expect.any(String),
            }),
          ]),
        );
      });

      it('should include chapter fields when findAll has include chapters param and filter by id', async () => {
        const response = await request(app.getHttpServer())
          .get('/book')
          .query({
            filter: {
              id: seedBookWithChapters._id.toString(),
            },
            include: ['chapters'],
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              chapters: expect.arrayContaining([
                expect.objectContaining({
                  content: expect.any(String),
                  createdAt: expect.any(String),
                  id: expect.any(String),
                  title: expect.any(String),
                  updatedAt: expect.any(String),
                }),
              ]),
              createdAt: expect.any(String),
              id: expect.any(String),
              slug: seedBookWithChapters.slug,
              title: seedBookWithChapters.title,
              updatedAt: expect.any(String),
            }),
          ]),
        );
      });
    });

    describe('CrudPost', () => {
      it('should create a book', async () => {
        const response = await request(app.getHttpServer())
          .post('/book')
          .send({ title: 'book 3' });
        const book = response.body;
        expect(book).toBeDefined();
        expect(response.status).toBe(201);

        const books = await request(app.getHttpServer())
          .get('/book')
          .query({
            filter: {
              title: 'book',
            },
          });
        expect(books.body).toHaveLength(3);

        const resFindOne = await request(app.getHttpServer())
          .get('/book/id')
          .query({ filter: { id: book.id } });
        expect(resFindOne.body).toEqual(
          expect.objectContaining({
            chapters: expect.arrayContaining([]),
            createdAt: expect.any(String),
            id: expect.any(String),
            slug: book.slug,
            title: book.title,
            updatedAt: expect.any(String),
          }),
        );
      });

      it('should be able to create a book with a duplicate title', async () => {
        const response = await request(app.getHttpServer())
          .post('/book')
          .send({ title: seedBookList[0].title });
        expect(response.status).toBe(201);
        expect(response.body).toBeDefined();
        expect(response.body.title).toBe(seedBookList[0].title);
        expect(response.body.slug).toBe(seedBookList[0].slug);
      });

      it('should not create a book with an empty title', async () => {
        const response = await request(app.getHttpServer())
          .post('/book')
          .send({ title: '', summary: '' });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(['title should not be empty']);
      });

      it('should not create a book with a title or summary that is too long', async () => {
        const response = await request(app.getHttpServer())
          .post('/book')
          .send({ title: 'a'.repeat(51), summary: 'a'.repeat(301) });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual([
          'title must be shorter than or equal to 50 characters',
          'summary must be shorter than or equal to 300 characters',
        ]);
      });
    });

    describe('CrudPut', () => {
      it('should update a book', async () => {
        const newTitle = 'new book title';
        const response = await request(app.getHttpServer())
          .put(`/book`)
          .send({ id: seedBookList[0]._id.toString(), title: newTitle });

        const book = response.body;
        expect(book).toBeDefined();
        expect(response.status).toBe(200);
        expect(book.title).toBe(newTitle);

        const books = await request(app.getHttpServer())
          .get('/book')
          .query({
            filter: {
              title: 'book',
            },
          });
        expect(books.body).toHaveLength(2);

        const resFindOne = await request(app.getHttpServer())
          .get('/book/id')
          .query({
            filter: { id: seedBookList[0]._id.toString() },
            include: ['chapters'],
          });

        expect(resFindOne.body).toEqual(
          expect.objectContaining({
            chapters: expect.arrayContaining([]),
            createdAt: expect.any(String),
            id: expect.any(String),
            slug: book.slug,
            title: newTitle,
            updatedAt: expect.any(String),
          }),
        );
      });
      it('should not update book without id in body', async () => {
        const response = await request(app.getHttpServer())
          .put(`/book`)
          .send({ title: 'new title' });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual([
          'id should not be null or undefined',
          'id invalid',
          'id must be a string',
        ]);
      });
      it('should throw 400 if id is not valid', async () => {
        const invalidId = 'invalidId';
        const response = await request(app.getHttpServer())
          .put(`/book`)
          .send({ id: invalidId, title: 'new title' });

        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(['id invalid']);
      });
      it('should not update a book that does not exist', async () => {
        const nonExistentId = new Types.ObjectId().toString();
        const response = await request(app.getHttpServer())
          .put(`/book`)
          .send({ id: nonExistentId, title: 'new title' });
        expect(response.status).toBe(404);
      });
      it('should not update a book with an empty title', async () => {
        const response = await request(app.getHttpServer())
          .put(`/book`)
          .send({ id: seedBookList[0]._id.toString(), title: '', summary: '' });

        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(['title should not be empty']);
      });
      it('should be able to update a book with a duplicate title', async () => {
        const response = await request(app.getHttpServer()).put(`/book`).send({
          id: seedBookList[0]._id.toString(),
          title: seedBookList[1].title,
        });

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.title).toBe(seedBookList[1].title);
        expect(response.body.slug).toBe(seedBookList[1].slug);
      });
    });

    describe('CrudPatch', () => {
      it('should patch a book', async () => {
        const newTitle = 'New Title Book';
        const response = await request(app.getHttpServer())
          .patch(`/book`)
          .send({ id: seedBookList[0]._id.toString(), title: newTitle });

        const book = response.body;
        expect(book).toBeDefined();
        expect(response.status).toBe(200);
        expect(book.title).toBe(newTitle);

        const books = await request(app.getHttpServer())
          .get('/book')
          .query({
            filter: {
              title: 'book',
            },
          });
        expect(books.body).toHaveLength(2);

        const resFindOne = await request(app.getHttpServer())
          .get(`/book/id`)
          .query({
            filter: {
              id: seedBookWithChapters._id.toString(),
            },
          });

        expect(resFindOne.body).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            title: newTitle,
            slug: book.slug,
            chapters: expect.arrayContaining([
              expect.objectContaining({ id: expect.any(String) }),
            ]),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        );
      });
      it('should not patch book with an empty title', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/book`)
          .send({ id: seedBookList[0]._id.toString(), title: '' });

        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(['title should not be empty']);
      });
      it('should not patch a book without id in body', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/book`)
          .send({ title: 'new title' });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual([
          'id should not be null or undefined',
          'id invalid',
          'id must be a string',
        ]);
      });
      it('should not patch a book with a non existing book id', async () => {
        const randomId = new Types.ObjectId().toString();
        const response = await request(app.getHttpServer())
          .patch(`/book`)
          .send({ id: randomId, title: 'new title' });
        expect(response.status).toBe(404);
      });
      it('should not patch a book with a invalid book id', async () => {
        const invalidId = 'invalidId';
        const response = await request(app.getHttpServer())
          .patch(`/book`)
          .send({ id: invalidId, title: 'new title' });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(['id invalid']);
      });
      it('should patch a book title with a duplicate title', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/book`)
          .send({
            id: seedBookList[0]._id.toString(),
            title: seedBookList[1].title,
          });

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.title).toBe(seedBookList[1].title);
        expect(response.body.slug).toBe(seedBookList[1].slug);
      });
      it('should not patch a book title that is too long', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/book`)
          .send({
            id: seedBookList[0]._id.toString(),
            title: 'a'.repeat(51),
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toEqual([
          'title must be shorter than or equal to 50 characters',
        ]);
      });
    });

    describe('CrudDelete', () => {
      it('should delete a book', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/book`)
          .query({
            filter: { id: seedBookList[0]._id.toString() },
          });
        expect(response.status).toBe(204);

        const books = await request(app.getHttpServer())
          .get('/book')
          .query({
            filter: {
              title: 'book',
            },
          });
        expect(books.body).toHaveLength(seedBookList.length - 1);
      });
      it('should throw an error when the book does not exist', async () => {
        const nonExistentId = new Types.ObjectId().toString();
        const response = await request(app.getHttpServer())
          .delete(`/book`)
          .query({
            filter: { id: nonExistentId },
          });
        expect(response.status).toBe(404);
      });
      it('should throw an error when the book id is invalid', async () => {
        const invalidId = 'invalidId';
        const response = await request(app.getHttpServer())
          .delete(`/book`)
          .query({
            filter: { id: invalidId },
          });
        expect(response.status).toBe(400);
      });
      it('should throw an error when the book id is not provided in the query', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/book`)
          .query({
            filter: {
              title: 'book',
            },
          });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual([
          'filter.id should not be null or undefined',
          'filter.id invalid',
          'filter.id must be a string',
        ]);
      });
      it('should throw an error when filter is not provided', async () => {
        const response = await request(app.getHttpServer()).delete(`/book`);
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual([
          'filter should not be null or undefined',
        ]);
      });
    });
  });
});
