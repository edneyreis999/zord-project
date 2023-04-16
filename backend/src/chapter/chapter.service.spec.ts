import { Test, TestingModule } from '@nestjs/testing';
import { ChapterService } from './chapter.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from './schemas/chapter.schema';
import { Arc, ArcSchema } from '../schemas/arc';
import { Scene, SceneSchema } from '../schemas/scene';
import { TextFileService } from '../text-file/text-file.service';
import { BookService } from '../book/book.service';
import { Book, BookSchema } from '../book/schemas/book.schema';
import { setupMongoMemoryServer } from '../../test/mongoMemoryServerSetup';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model, Types } from 'mongoose';

describe('ChapterService', () => {
  let defaultBook: Book;
  let chapterService: ChapterService;
  let bookService: BookService;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await setupMongoMemoryServer();
    const uri = mongod.getUri();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: Book.name, schema: BookSchema },
          { name: Chapter.name, schema: ChapterSchema },
          { name: Arc.name, schema: ArcSchema },
          { name: Scene.name, schema: SceneSchema },
        ]),
      ],
      providers: [ChapterService, TextFileService, BookService],
    }).compile();

    chapterService = module.get<ChapterService>(ChapterService);
    bookService = module.get<BookService>(BookService);

    // Popule o banco de dados com os dados iniciais
    await seedBd();
  });

  const seedBd = async () => {
    defaultBook = await bookService.create({
      title: 'bookdefault',
    });
  };

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await mongod.stop();
  });

  describe('ChapterModel', () => {
    it('should be defined', () => {
      expect(chapterService).toBeDefined();
    });

    it('should create a chapter', async () => {
      const chapterName = 'test chapter';

      const result = await chapterService.create({
        title: chapterName,
        bookId: defaultBook._id.toString(),
      });

      expect(result).toMatchObject({
        __v: 0,
        _id: expect.any(Types.ObjectId),
        arcs: expect.any(Array),
        title: chapterName,
      });
      expect(result.arcs).toHaveLength(0);
    });
    it('should create a chapter with content', async () => {
      const chapterName = 'test chapter with file';
      const chapterContent = 'conteúdo do capítulo';

      const result = await chapterService.create({
        title: chapterName,
        bookId: defaultBook._id.toString(),
        content: chapterContent,
      });

      expect(result).toMatchObject({
        __v: 0,
        _id: expect.any(Types.ObjectId),
        arcs: expect.any(Array),
        title: chapterName,
        content: chapterContent,
      });
      expect(result.arcs).toHaveLength(0);
    });
    it('should throw an exception when create method fails', async () => {
      const chapterName = { fail: 'test chapter' } as unknown as string;

      await expect(
        chapterService.create({
          title: chapterName,
          bookId: defaultBook._id.toString(),
        }),
      ).rejects.toThrowError();
    });
  });
});
