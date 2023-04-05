import { Test, TestingModule } from '@nestjs/testing';
import { ChapterService } from './chapter.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from '../schemas/chapter';
import { Arc, ArcSchema } from '../schemas/arc';
import { Scene, SceneSchema } from '../schemas/scene';

describe('ChapterService', () => {
  let service: ChapterService;

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
      providers: [ChapterService],
    }).compile();

    service = module.get<ChapterService>(ChapterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
