import { Test, TestingModule } from '@nestjs/testing';
import { ChapterService } from './chapter.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from '../schemas/chapter';
import { Arc, ArcSchema } from '../schemas/arc';
import { Scene, SceneSchema } from '../schemas/scene';
import mongoose, { Model } from 'mongoose';
import { TextFileService } from './text-file.service';

describe('ChapterService', () => {
  let chapterService: ChapterService;

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
      providers: [ChapterService, TextFileService],
    }).compile();

    chapterService = module.get<ChapterService>(ChapterService);
  });

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('ChapterModel', () => {
    it('should be defined', () => {
      expect(chapterService).toBeDefined();
    });

    it('should create a chapter', async () => {
      const model = Model<Chapter>;
      const chapterName = 'test chapter';
      const chapterModelSpy = jest.spyOn(model, 'create');

      const result = await chapterService.createChapter(chapterName);

      expect(model.create).toHaveBeenCalledWith({
        name: chapterName,
      });
      expect(chapterModelSpy).toHaveBeenCalled();

      expect(result).toMatchObject({
        __v: 0,
        _id: expect.any(mongoose.Types.ObjectId),
        arcs: expect.any(Array),
        name: chapterName,
      });
      expect(result.arcs).toHaveLength(0);
    });
    it('should create a chapter with content', async () => {
      const chapterName = 'test chapter';
      const chapterContent = 'conteúdo do capítulo';

      const result = await chapterService.createChapter(
        chapterName,
        chapterContent,
      );

      expect(result).toMatchObject({
        __v: 0,
        _id: expect.any(mongoose.Types.ObjectId),
        arcs: expect.any(Array),
        name: chapterName,
        content: chapterContent,
      });
      expect(result.arcs).toHaveLength(0);
    });
    it('should throw an exception when create method fails', async () => {
      const chapterName = { fail: 'test chapter' } as unknown as string;

      await expect(
        chapterService.createChapter(chapterName),
      ).rejects.toThrowError();
    });
  });
});
