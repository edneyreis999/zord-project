import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from '../schemas/book';
import { setupMongoMemoryServer } from '../../test/mongoMemoryServerSetup';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('BookController', () => {
  let controller: BookController;
  let mongod: MongoMemoryServer;

  beforeEach(async () => {
    mongod = await setupMongoMemoryServer();
    const uri = mongod.getUri();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
      ],
      controllers: [BookController],
      providers: [BookService],
    }).compile();

    controller = module.get<BookController>(BookController);
  });

  afterAll(async () => {
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
