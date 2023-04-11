import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from '../schemas/book';
import { setupMongoMemoryServer } from '../../test/mongoMemoryServerSetup';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('BookService', () => {
  let service: BookService;
  let mongod: MongoMemoryServer;

  beforeEach(async () => {
    mongod = await setupMongoMemoryServer();
    const uri = mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
      ],
      providers: [BookService],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  afterAll(async () => {
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
