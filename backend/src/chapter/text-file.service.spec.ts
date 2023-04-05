import { Test, TestingModule } from '@nestjs/testing';
import { TextFileService } from './text-file.service';

describe('TextFileService', () => {
  let service: TextFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextFileService],
    }).compile();

    service = module.get<TextFileService>(TextFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
