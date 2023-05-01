import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClsService } from 'nestjs-cls';
import { BookService } from '../book/book.service';
import { Book, BookSchema } from '../book/schemas/book.schema';
import { Arc, ArcSchema } from '../schemas/arc';
import { Scene, SceneSchema } from '../schemas/scene';
import { FetchBookByIdPipe } from '../shared/pipes/fetch.book.by.id.pipe';
import { FetchChapterByIdPipe } from '../shared/pipes/fetch.chapter.by.id.pipe';
import { ValidateUniqueOrderPipe } from '../shared/pipes/validate.unique.order.pipe';
import { ValidateUniqueTitlePipe } from '../shared/pipes/validate.unique.title.pipe';
import { TextFileService } from '../text-file/text-file.service';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { Chapter, ChapterSchema } from './schemas/chapter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: Chapter.name, schema: ChapterSchema },
      { name: Arc.name, schema: ArcSchema },
      { name: Scene.name, schema: SceneSchema },
    ]),
    ClsService,
  ],
  controllers: [ChapterController],
  providers: [
    ChapterService,
    TextFileService,
    BookService,
    ValidateUniqueTitlePipe,
    ValidateUniqueOrderPipe,
    FetchBookByIdPipe,
    FetchChapterByIdPipe,
  ],
})
export class ChapterModule {}
