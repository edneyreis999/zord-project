import { Test, TestingModule } from '@nestjs/testing';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { TextFileService } from './text-file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from '../schemas/chapter';
import { Arc, ArcSchema } from '../schemas/arc';
import { Scene, SceneSchema } from '../schemas/scene';
import { HttpException, HttpStatus } from '@nestjs/common';
import mongoose from 'mongoose';

describe('ChapterController', () => {
  let controller: ChapterController;
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
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/zord'),
        MongooseModule.forFeature([
          { name: Chapter.name, schema: ChapterSchema },
          { name: Arc.name, schema: ArcSchema },
          { name: Scene.name, schema: SceneSchema },
        ]),
      ],
      controllers: [ChapterController],
      providers: [ChapterService, TextFileService],
    }).compile();

    controller = module.get<ChapterController>(ChapterController);
  });

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
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
      controller.createChapter({} as any, invalidFile as any),
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
      defaultReqFile as any,
    );

    expect(result).toBeDefined();
    expect(result).toMatchObject({
      name: chapterName,
      arcs: ['arc-1', 'arc-2'],
    });
    expect(readFileSpy).toHaveBeenCalledWith(expect.any(Object));
    expect(createChapterSpy).toHaveBeenCalledWith(chapterName, chapterContent);
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
