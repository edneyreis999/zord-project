import { Test, TestingModule } from '@nestjs/testing';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { TextFileService } from '../text-file/text-file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from './schemas/chapter.schema';
import { Arc, ArcSchema } from '../schemas/arc';
import { Scene, SceneSchema } from '../schemas/scene';
import { BookService } from '../book/book.service';
import { Book, BookSchema } from '../book/schemas/book.schema';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/MongooseTestModule';
import mongoose, { Model } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ChapterController', () => {
  // references to the controller and service
  let controller: ChapterController;
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
      controllers: [ChapterController],
      providers: [ChapterService, TextFileService, BookService],
    }).compile();

    controller = module.get<ChapterController>(ChapterController);
    service = module.get<ChapterService>(ChapterService);
    model = module.get<Model<Chapter>>('ChapterModel');

    bookService = module.get<BookService>(BookService);
    bookModel = module.get<Model<Book>>('BookModel');
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

    seedDummyChapter = await service.create({
      bookId: seedBookList[0]._id.toString(),
      ...dummyChapter,
      title: 'chapter 1',
    });

    await service.create({
      bookId: seedBookList[0]._id.toString(),
      ...dummyChapter,
    });
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a dummy chapter', async () => {
    const bookId = seedBookList[0]._id.toString();
    const summary = 'summary of the chapter';
    const content = 'content of the chapter';
    const chapter = await controller.create({
      bookId: bookId,
      title: 'title',
      summary: summary,
      content: content,
    });
    expect(chapter).toBeDefined();

    const chapters = await controller.findAll(bookId);
    expect(chapters).toHaveLength(seedBookList.length + 1);

    const chapter2 = await controller.findOne(chapter.id, {});
    expect(chapter2).toBeDefined();
    expect(chapter2.id).toEqual(chapter.id);
    expect(chapter2.summary).toEqual(chapter.summary);
    expect(chapter2.content).toEqual(chapter.content);
    expect(chapter2.order).toEqual(chapter.order);
  });

  it('should throw error when create chapter with same order', async () => {
    const bookId = seedBookList[0]._id.toString();
    const order = seedDummyChapter.order;

    await expect(
      controller.create({
        bookId: bookId,
        title: 'title',
        order,
      }),
    ).rejects.toThrowError(
      `There is already a chapter with order '${order}' in book '${bookId}'.`,
    );
  });

  it('should not create a chapter with a duplicate name', async () => {
    const bookId = seedBookList[0]._id.toString();
    const title = seedDummyChapter.title;
    // Try to create the second book with the same name and expect a rejection
    await expect(
      controller.create({
        bookId,
        title,
      }),
    ).rejects.toThrowError(
      `There is already a chapter with title '${title}' in book '${bookId}'.`,
    );
  });

  it('should get all chapters from a book', async () => {
    const bookId = seedBookList[0]._id.toString();
    const books = await controller.findAll(bookId);
    expect(books).toHaveLength(seedBookList.length);

    await service.create({
      bookId,
      title: 'chapter 3',
    });

    const books2 = await controller.findAll(bookId);
    expect(books2).toHaveLength(seedBookList.length + 1);
  });

  it('should get the chapter by id', async () => {
    const chapter = await controller.findOne(seedDummyChapter._id.toString());

    expect(chapter).toBeDefined();
    expect(chapter.id).toEqual(seedDummyChapter._id.toString());
  });

  it('should update the chapter', async () => {
    const bookId = seedBookList[0]._id.toString();
    const chapter = await controller.update(seedDummyChapter._id.toString(), {
      bookId,
      title: 'new title',
      summary: 'new summary',
      content: 'new content',
    });

    expect(chapter).toBeDefined();
    expect(chapter.id).toEqual(seedDummyChapter._id.toString());
    expect(chapter.title).toEqual('new title');
    expect(chapter.summary).toEqual('new summary');
    expect(chapter.content).toEqual('new content');
  });

  it('should throw error when update chapter with same order', async () => {
    const bookId = seedBookList[0]._id.toString();
    const order = seedDummyChapter.order;

    await expect(
      controller.update(seedDummyChapter._id.toString(), {
        bookId,
        order,
      }),
    ).rejects.toThrowError(
      `There is already a chapter with order '${order}' in book '${bookId}'.`,
    );
  });

  it('should delete the chapter', async () => {
    const chapter = await service.findOne({
      filter: {
        id: seedDummyChapter._id.toString(),
      },
    });
    expect(chapter).toBeDefined();

    const chapterDeleted = await controller.remove(chapter._id.toString());
    expect(chapterDeleted).toBeDefined();
    expect(chapterDeleted.id).toEqual(chapter._id.toString());

    const chapterAfter = await service.findOne({
      filter: {
        id: chapterDeleted.id,
      },
    });
    expect(chapterAfter).toBeNull();
  });
  it('should throw an error when trying to delete a chapter that not exists.', async () => {
    await expect(
      controller.remove('5f5f9b9c6b5b1e1c6c5f1b3c'),
    ).rejects.toThrowError();
  });
  it('should not update a chapter that does not exist', async () => {
    const bookId = seedBookList[0]._id.toString();
    await expect(
      controller.update('5f5f9b9c6b5b1e1c6c5f1b3c', {
        bookId,
        title: 'New Name',
      }),
    ).rejects.toThrowError();
  });
  it('should not get a chapter by id that does not exist', async () => {
    await expect(
      controller.findOne('5f5f9b9c6b5b1e1c6c5f1b3c', {}),
    ).rejects.toThrowError();
  });

  it('should not create a chapter with an empty title', async () => {
    const bookId = seedBookList[0]._id.toString();
    await expect(
      controller.create({
        bookId,
        title: '',
      }),
    ).rejects.toThrowError();
  });
  it('should not create a chapter with a title that is too long', async () => {
    const bookId = seedBookList[0]._id.toString();
    await expect(
      controller.create({
        bookId,
        title: 'a'.repeat(256),
      }),
    ).rejects.toThrowError();
  });
  it('should not update an chapter with an empty title', async () => {
    const bookId = seedBookList[0]._id.toString();
    await expect(
      controller.update(seedBookList[0]._id.toString(), {
        bookId,
        title: '',
      }),
    ).rejects.toThrowError(
      'Validation failed: title: Path `title` is required.',
    );
  });
  it('should not update an chapter with a duplicate title', async () => {
    const bookId = seedBookList[0]._id.toString();
    await controller.create({
      bookId,
      title: 'Title',
    });

    // Try to update the second book with the same name and expect a rejection
    await expect(
      controller.update(seedDummyChapter._id.toString(), {
        bookId,
        title: 'Title',
      }),
    ).rejects.toThrowError();
  });
  it('should patch a chapter', async () => {
    const bookId = seedBookList[0]._id.toString();
    const chapter = await controller.patch(seedDummyChapter._id.toString(), {
      bookId,
      title: 'New Name',
      summary: 'New Summary',
    });
    expect(chapter).toBeDefined();
    expect(chapter.id).toEqual(seedDummyChapter._id.toString());
    expect(chapter.title).toEqual('New Name');
    expect(chapter.slug).toEqual('new-name');
    expect(chapter.summary).toEqual('New Summary');

    const chapter2 = await controller.findOne(chapter.id, {});
    expect(chapter2).toBeDefined();
    expect(chapter2.id).toEqual(chapter.id);
    expect(chapter2.title).toEqual('New Name');
    expect(chapter2.slug).toEqual('new-name');
    expect(chapter.summary).toEqual('New Summary');
  });
  it('should filter partial and case-sensitive when filtering chapter title', async () => {
    const bookId = seedBookList[0]._id.toString();
    const books = await controller.findAll(bookId, {
      filter: {
        title: 'chapter',
      },
    });
    expect(books).toHaveLength(seedBookList.length);
  });
  it('should filter partial and case-sensitive when filtering chapter slug', async () => {
    const bookId = seedBookList[0]._id.toString();
    const books = await controller.findAll(bookId, {
      filter: {
        slug: 'chapter',
      },
    });
    expect(books).toHaveLength(seedBookList.length);
  });

  it('should sort desc by name when findAll ', async () => {
    const bookId = seedBookList[0]._id.toString();
    const chapters = await controller.findAll(bookId, {
      page: { limit: 2, offset: 0 },
      sort: ['-title'],
    });
    expect(chapters).toHaveLength(seedBookList.length);
    expect(chapters[0].title).toEqual('dummy chapter');
    expect(chapters[1].title).toEqual('chapter 1');
  });
  it('should sort asc by name when findAll ', async () => {
    const bookId = seedBookList[0]._id.toString();
    const chapters = await controller.findAll(bookId, {
      page: { limit: 2, offset: 0 },
      sort: ['title'],
    });
    expect(chapters).toHaveLength(seedBookList.length);
    expect(chapters[0].title).toEqual('chapter 1');
    expect(chapters[1].title).toEqual('dummy chapter');
  });
  it.todo('should include arcs fields when findAll has include param');
  it.todo('should include arcs fields when findOne has include param');
  it('should create a chapter with a file', async () => {
    const bookId = seedBookList[0]._id.toString();
    const chapter = await controller.createChapterByFile(
      bookId,
      {
        bookId,
        title: 'New Chapter',
      },
      defaultReqFile as any,
    );
    expect(chapter).toBeDefined();
    expect(chapter.title).toEqual('New Chapter');
    expect(chapter.slug).toEqual('new-chapter');
    expect(chapter.content).toEqual(defaultStringFileContent);
  });
  it('should throw an error when an invalid file type is uploaded', async () => {
    const bookId = seedBookList[0]._id.toString();
    const reqFile = {
      ...defaultReqFile,
      originalname: 'test.docx',
      mimetype: 'image/png',
    };
    await expect(
      controller.createChapterByFile(
        bookId,
        {
          bookId,
          title: 'New Chapter',
        },
        reqFile as any,
      ),
    ).rejects.toThrowError('Invalid file type. Use .txt files');
  });
  it('should create a chapter with arcs and scenes', async () => {
    const chapterContent = `Chapter content <arc> Arc 1 content <scene> Scene 1 content </scene> <scene> Scene 2 content </scene></arc>
    <arc> Arc 2 content <scene> Scene 1 content </scene> <scene> Scene 2 content </scene></arc>`;
    const bookId = seedBookList[0]._id.toString();
    const file = {
      ...defaultReqFile,
      originalname: 'test.txt',
      mimetype: 'text/plain',
      buffer: Buffer.from(chapterContent),
    };
    const readFileSpy = jest.spyOn(TextFileService.prototype, 'readFile');

    const chapter = await controller.createChapterByFile(
      bookId,
      {
        bookId,
        title: 'New Chapter',
      },
      file as any,
    );

    expect(chapter).toBeDefined();
    expect(chapter.title).toEqual('New Chapter');
    expect(chapter.slug).toEqual('new-chapter');
    expect(chapter.content).toEqual(chapterContent);
    expect(chapter.arcs).toHaveLength(2);
    expect(readFileSpy).toHaveBeenCalledWith(file);
  });
  it('should throw an error when an error occurs during chapter creation', async () => {
    const bookId = seedBookList[0]._id.toString();
    const file = {
      ...defaultReqFile,
      originalname: 'test.txt',
      mimetype: 'text/plain',
      buffer: Buffer.from('chapterContent'),
    };

    jest
      .spyOn(ChapterService.prototype, 'create')
      .mockRejectedValueOnce(
        new Error('Somenting went wrong during chapter creation'),
      );

    await expect(
      controller.createChapterByFile(
        bookId,
        {
          bookId,
          title: 'New Chapter',
        },
        file as any,
      ),
    ).rejects.toThrowError(
      new HttpException(
        'Somenting went wrong during chapter creation',
        HttpStatus.BAD_REQUEST,
      ),
    );
  });
});
