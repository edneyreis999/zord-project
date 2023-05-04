import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Arc, ArcSchema } from '../arc/schemas/arc';
import { ChapterService } from '../chapter/chapter.service';
import { Chapter, ChapterSchema } from '../chapter/schemas/chapter.schema';
import { Scene, SceneSchema } from '../scene/schemas/scene';
import { FetchBookByIdPipe } from '../shared/pipes/fetch.book.by.id.pipe';
import { TextFileService } from '../text-file/text-file.service';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Book, BookSchema } from './schemas/book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: Chapter.name, schema: ChapterSchema },
      { name: Arc.name, schema: ArcSchema },
      { name: Scene.name, schema: SceneSchema },
    ]),
    // ClsService,
  ],
  providers: [BookService, ChapterService, FetchBookByIdPipe, TextFileService],
  controllers: [BookController],
})
export class BookModule {}
