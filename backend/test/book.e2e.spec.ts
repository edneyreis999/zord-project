import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { rootMongooseTestModule } from './MongooseTestModule';
import { MongooseModule } from '@nestjs/mongoose';
import { BookController } from '../src/book/book.controller';
import { BookService } from '../src/book/book.service';
import { Book, BookSchema } from '../src/book/schemas/book.schema';
import { ChapterService } from '../src/chapter/chapter.service';
import { Chapter, ChapterSchema } from '../src/chapter/schemas/chapter.schema';
import { Arc, ArcSchema } from '../src/schemas/arc';
import { Scene, SceneSchema } from '../src/schemas/scene';
import { TextFileService } from '../src/text-file/text-file.service';
import { Model, Types } from 'mongoose';
import { IsValidObjectIdAndExists } from '../src/shared/validations/validation.objectId-exists';
import { SetValidOrderConstraint } from '../src/shared/validations/validation.order';
import { UniqueTitle } from '../src/shared/validations/validation.title';
import { useContainer } from 'class-validator';

describe('BookController (e2e)', () => {
  let app: INestApplication;
  let service: BookService;
  let chapterService: ChapterService;
  let bookModel: Model<Book>;
  let chapterModel: Model<Chapter>;

  let seedBookList: Book[];
  let seedBookWithChapters: Book;

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
      controllers: [BookController],
      providers: [
        ChapterService,
        TextFileService,
        BookService,
        UniqueTitle,
        IsValidObjectIdAndExists,
        SetValidOrderConstraint,
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

    await Promise.all([
      chapterService.createWithText({
        title: 'Chapter 1',
        bookId: seedBookWithChapters._id.toString(),
        content: 'bla bla bla',
      }),
      chapterService.createWithText({
        title: 'Chapter 2',
        bookId: seedBookWithChapters._id.toString(),
        content: 'blu blu blu',
      }),
    ]);

    seedBookList = [book0, book1];
  };

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
      expect(resFindOne.status).toBe(400);
      expect(resFindOne.body.message).toEqual([
        `filter.id is invalid with value ${randomId}.`,
      ]);
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
        message: [`filter.id is invalid with value ${wrongId}.`],
        error: 'Bad Request',
      });
    });
  });

  describe('CrudGetAll', () => {
    it('should get all books', async () => {
      const response = await request(app.getHttpServer()).get('/book');

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

    it('should filter partial and case sensitive filter to name when findAll', async () => {
      const response = await request(app.getHttpServer())
        .get('/book')
        .query({ filter: { title: 'book' } });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should filter partial and case sensitive filter to slug when findAll', async () => {
      const response = await request(app.getHttpServer())
        .get('/book')
        .query({ filter: { slug: 'book' } });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should sort desc by title when findAll ', async () => {
      const response = await request(app.getHttpServer())
        .get('/book')
        .query({
          page: { limit: 2, offset: 0 },
          sort: ['-title'],
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(seedBookList.length);
      expect(response.body[0].title).toBe('Book 1');
      expect(response.body[1].title).toBe('Book 0');
    });

    it('should sort asc by title when findAll ', async () => {
      const response = await request(app.getHttpServer())
        .get('/book')
        .query({
          page: { limit: 2, offset: 0 },
          sort: ['title'],
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(seedBookList.length);
      expect(response.body[0].title).toBe('Book 0');
      expect(response.body[1].title).toBe('Book 1');
    });

    it(`should include chapter fields when findAll has include 'chapters' param`, async () => {
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

    it(`should include chapter fields when findAll has include 'chapters' param and filter by id`, async () => {
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
        .send({ title: 'title' });
      const book = response.body;
      expect(book).toBeDefined();
      expect(response.status).toBe(201);

      const books = (await request(app.getHttpServer()).get('/book')).body;
      expect(books).toHaveLength(3);

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

    it('should not create a book with an empty title or summary', async () => {
      const response = await request(app.getHttpServer())
        .post('/book')
        .send({ title: '', summary: '' });
      expect(response.status).toBe(400);
      expect(response.body.message).toEqual([
        'title should not be empty',
        'summary should not be empty',
      ]);
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
      const newTitle = 'new title';
      const response = await request(app.getHttpServer())
        .put(`/book`)
        .query({
          filter: { id: seedBookList[0]._id.toString() },
        })
        .send({ title: newTitle });

      const book = response.body;
      expect(book).toBeDefined();
      expect(response.status).toBe(200);
      expect(book.title).toBe(newTitle);

      const books = (await request(app.getHttpServer()).get('/book')).body;
      expect(books).toHaveLength(2);

      const resFindOne = await request(app.getHttpServer())
        .get('/book/id')
        .query({ filter: { id: book.id } });
      expect(resFindOne.body).toEqual(
        expect.objectContaining({
          chapters: expect.arrayContaining([
            expect.objectContaining({ id: expect.any(String) }),
          ]),
          createdAt: expect.any(String),
          id: expect.any(String),
          slug: book.slug,
          title: newTitle,
          updatedAt: expect.any(String),
        }),
      );
    });

    it('should not update a book that does not exist', async () => {
      const response = await request(app.getHttpServer())
        .put(`/book/${new Types.ObjectId().toString()}`)
        .send({ title: 'new title' });
      expect(response.status).toBe(404);
    });

    it('should not update a book with an empty title or summary', async () => {
      const response = await request(app.getHttpServer())
        .put(`/book`)
        .query({
          filter: { id: seedBookList[0]._id.toString() },
        })
        .send({ title: '', summary: '' });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual([
        'title should not be empty',
        'summary should not be empty',
      ]);
    });

    it('should be able to update a book with a duplicate title', async () => {
      const response = await request(app.getHttpServer())
        .put(`/book`)
        .query({
          filter: { id: seedBookList[0]._id.toString() },
        })
        .send({ title: seedBookList[1].title });

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.title).toBe(seedBookList[1].title);
      expect(response.body.slug).toBe(seedBookList[1].slug);
    });
    it('should throw 400 if id is not valid', async () => {
      const invalidId = 'invalidId';
      const response = await request(app.getHttpServer())
        .put(`/book`)
        .query({
          filter: { id: invalidId },
        })
        .send({ title: 'new title' });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual([
        'filter.id is invalid with value invalidId.',
      ]);
    });
  });

  describe('CrudPatch', () => {
    it('should patch a book', async () => {
      const newTitle = 'New Title';
      const response = await request(app.getHttpServer())
        .patch(`/book`)
        .query({
          filter: { id: seedBookList[0]._id.toString() },
        })
        .send({ title: newTitle });

      const book = response.body;
      expect(book).toBeDefined();
      expect(response.status).toBe(200);
      expect(book.title).toBe(newTitle);

      const books = (await request(app.getHttpServer()).get('/book')).body;
      expect(books).toHaveLength(2);

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
  });

  describe('CrudDelete', () => {
    it('should delete a book', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/book`)
        .query({
          filter: { id: seedBookList[0]._id.toString() },
        });
      expect(response.status).toBe(204);

      const books = (await request(app.getHttpServer()).get('/book')).body;
      expect(books).toHaveLength(seedBookList.length - 1);
    });

    it('should not delete a book that does not exist', async () => {
      const randomId = new Types.ObjectId().toString();
      const response = await request(app.getHttpServer())
        .delete(`/book`)
        .query({
          filter: { id: randomId },
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual([
        `filter.id is invalid with value ${randomId}.`,
      ]);

      const books = (await request(app.getHttpServer()).get('/book')).body;
      expect(books).toHaveLength(seedBookList.length);
    });

    it('should thorw 400 if id is not valid', async () => {
      const invalidId = '123';
      const response = await request(app.getHttpServer())
        .delete(`/book`)
        .query({
          filter: { id: invalidId },
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual([
        `filter.id is invalid with value ${invalidId}.`,
      ]);

      const books = (await request(app.getHttpServer()).get('/book')).body;
      expect(books).toHaveLength(seedBookList.length);
    });
  });
});
