import { Module } from '@nestjs/common';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { TextFileService } from './text-file.service';

@Module({
  controllers: [ChapterController],
  providers: [ChapterService, TextFileService],
})
export class ChapterModule {}
