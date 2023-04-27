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
import { TextFileService } from '../text-file/text-file.service';

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;
  let chapterService: ChapterService;
  let bookModel: Model<Book>;
  let chapterModel: Model<Chapter>;

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

    const [book0] = await Promise.all(promise);

    await chapterService.createWithText({
      title: 'Chapter 1',
      bookId: book0._id,
      content: 'bla bla bla',
    });
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
