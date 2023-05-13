import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Arc, ArcSchema } from '../arc/schemas/arc.schema';
import { ChapterModule } from '../chapter/chapter.module';
import { Chapter, ChapterSchema } from '../chapter/schemas/chapter.schema';
import { Scene, SceneSchema } from '../scene/schemas/scene.schema';
import { FetchBookByIdPipe } from '../shared/pipes/fetch.book.by.id.pipe';
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
    ChapterModule,
    // ClsService,
  ],
  providers: [BookService, FetchBookByIdPipe],
  controllers: [BookController],
})
export class BookModule {}
