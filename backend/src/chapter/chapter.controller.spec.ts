import { Test, TestingModule } from '@nestjs/testing';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { TextFileService } from './text-file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from '../schemas/chapter';
import { Arc, ArcSchema } from '../schemas/arc';
import { Scene, SceneSchema } from '../schemas/scene';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BookService } from '../book/book.service';
import { Book, BookSchema } from '../schemas/book';
import { setupMongoMemoryServer } from '../../test/mongoMemoryServerSetup';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('ChapterController', () => {
  let defaultBook: Book;
  let controller: ChapterController;
  let bookService: BookService;
  let mongod: MongoMemoryServer;

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
      controllers: [ChapterController],
      providers: [ChapterService, TextFileService, BookService],
    }).compile();

    controller = module.get<ChapterController>(ChapterController);
    bookService = module.get<BookService>(BookService);

    // Popule o banco de dados com os dados iniciais
    await seedBd();
  });

  const seedBd = async () => {
    defaultBook = await bookService.create({
      name: 'bookdefault',
    });
  };

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a chapter', async () => {
    const chapterName = 'chapter-1';
    const readFileSpy = jest.spyOn(TextFileService.prototype, 'readFile');
    const extractArcsSpy = jest.spyOn(TextFileService.prototype, 'extractArcs');
    const createChapterModelSpy = jest.spyOn(
      ChapterService.prototype,
      'createChapter',
    );
    const createArcSpy = jest.spyOn(ChapterService.prototype, 'createArc');
    const createSceneSpy = jest.spyOn(ChapterService.prototype, 'createScene');

    const result = await controller.createChapter(
      {
        name: chapterName,
      } as any,
      defaultBook._id.toString(),
      defaultReqFile as any,
    );

    expect(result).toBeDefined();
    expect(result).toMatchObject({
      name: chapterName,
      arcs: [],
    });
    expect(readFileSpy).toHaveBeenCalledWith(defaultReqFile);
    expect(createChapterModelSpy).toHaveBeenCalledWith(
      chapterName,
      defaultBook._id.toString(),
      defaultStringFileContent,
    );
    expect(extractArcsSpy).toHaveBeenCalledWith(defaultStringFileContent);
    expect(createArcSpy).not.toHaveBeenCalled();
    expect(createSceneSpy).not.toHaveBeenCalled();
  });

  it('should throw an error when an invalid file type is uploaded', async () => {
    const invalidFile = {
      fieldname: 'file',
      originalname: 'cap1-zord.jpg', // invalid file type
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: defaultBufferFileContent,
      size: 31281,
    };

    await expect(
      controller.createChapter({} as any, '', invalidFile as any),
    ).rejects.toThrowError(
      new HttpException(
        'Invalid file type. Use .txt files',
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should create a chapter with arcs and scenes', async () => {
    const chapterName = 'chapter-1';
    const chapterContent = `Chapter content <arc> Arc 1 content <scene> Scene 1 content </scene> <scene> Scene 2 content </scene></arc>
      <arc> Arc 2 content <scene> Scene 1 content </scene> <scene> Scene 2 content </scene></arc>`;

    const readFileSpy = jest
      .spyOn(TextFileService.prototype, 'readFile')
      .mockResolvedValueOnce(chapterContent);
    const extractArcsSpy = jest.spyOn(TextFileService.prototype, 'extractArcs');
    const createChapterSpy = jest.spyOn(
      ChapterService.prototype,
      'createChapter',
    );
    const createArcSpy = jest.spyOn(ChapterService.prototype, 'createArc');
    const createSceneSpy = jest.spyOn(ChapterService.prototype, 'createScene');

    const result = await controller.createChapter(
      {
        name: chapterName,
      } as any,
      defaultBook._id.toString(),
      defaultReqFile as any,
    );

    expect(result).toBeDefined();
    expect(result).toMatchObject({
      name: chapterName,
      arcs: ['arc-1', 'arc-2'],
    });
    expect(readFileSpy).toHaveBeenCalledWith(expect.any(Object));
    expect(createChapterSpy).toHaveBeenCalledWith(
      chapterName,
      defaultBook._id.toString(),
      chapterContent,
    );
    expect(extractArcsSpy).toHaveBeenCalledWith(chapterContent);
    expect(createArcSpy).toHaveBeenCalledWith(
      'arc-1',
      ' Arc 1 content <scene> Scene 1 content </scene> <scene> Scene 2 content </scene>',
    );
    expect(createArcSpy).toHaveBeenCalledWith(
      'arc-2',
      ' Arc 2 content <scene> Scene 1 content </scene> <scene> Scene 2 content </scene>',
    );
    expect(createSceneSpy).toHaveBeenCalledTimes(4);
    expect(createSceneSpy).toHaveBeenCalledWith(
      'arc-1-scene-1',
      ' Scene 1 content ',
    );
    expect(createSceneSpy).toHaveBeenCalledWith(
      'arc-1-scene-2',
      ' Scene 2 content ',
    );
  });

  it('should throw an error when an error occurs during chapter creation', async () => {
    const chapterName = 'chapter-1';

    jest.spyOn(TextFileService.prototype, 'readFile');
    jest.spyOn(TextFileService.prototype, 'extractArcs');
    jest
      .spyOn(ChapterService.prototype, 'createChapter')
      .mockRejectedValueOnce(new Error('Error during chapter creation'));

    await expect(
      controller.createChapter(
        {
          name: chapterName,
        } as any,
        '',
        defaultReqFile as any,
      ),
    ).rejects.toThrowError(
      new HttpException(
        'Error during chapter creation',
        HttpStatus.BAD_REQUEST,
      ),
    );
  });
});
