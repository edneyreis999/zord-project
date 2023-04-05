import { Test, TestingModule } from '@nestjs/testing';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { TextFileService } from './text-file.service';

describe('ChapterController', () => {
  let controller: ChapterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChapterController],
      providers: [ChapterService, TextFileService],
    }).compile();

    controller = module.get<ChapterController>(ChapterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
