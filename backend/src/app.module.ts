import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChapterModule } from './chapter/chapter.module';
import { ChapterService } from './chapter/chapter.service';
import { TextFileService } from './text-file/text-file.service';
import { Chapter, ChapterSchema } from './chapter/schemas/chapter.schema';
import { Arc, ArcSchema } from './schemas/arc';
import { Scene, SceneSchema } from './schemas/scene';
import { BookModule } from './book/book.module';
import { BookService } from './book/book.service';
import { Book, BookSchema } from './book/schemas/book.schema';

@Module({
  imports: [
    ChapterModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/zord'),
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: Chapter.name, schema: ChapterSchema },
      { name: Arc.name, schema: ArcSchema },
      { name: Scene.name, schema: SceneSchema },
    ]),
    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChapterService, TextFileService, BookService],
})
export class AppModule {}
