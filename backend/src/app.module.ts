import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChapterModule } from './chapter/chapter.module';
import { ChapterService } from './chapter/chapter.service';
import { TextFileService } from './chapter/text-file.service';

@Module({
  imports: [ChapterModule],
  controllers: [AppController],
  providers: [AppService, ChapterService, TextFileService],
})
export class AppModule {}
