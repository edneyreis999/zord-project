import { Test, TestingModule } from '@nestjs/testing';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { TextFileService } from './text-file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from '../schemas/chapter';
import { Arc, ArcSchema } from '../schemas/arc';
import { Scene, SceneSchema } from '../schemas/scene';

describe('ChapterController', () => {
  let controller: ChapterController;

  beforeEach(async () => {
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
