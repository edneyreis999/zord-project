import { Module } from '@nestjs/common';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { TextFileService } from './text-file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from '../schemas/chapter';
import { Arc, ArcSchema } from '../schemas/arc';
import { Scene, SceneSchema } from '../schemas/scene';
import { BookService } from '../book/book.service';
import { Book, BookSchema } from '../schemas/book';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: Chapter.name, schema: ChapterSchema },
      { name: Arc.name, schema: ArcSchema },
      { name: Scene.name, schema: SceneSchema },
    ]),
  ],
  controllers: [ChapterController],
  providers: [ChapterService, TextFileService, BookService],
})
export class ChapterModule {}
