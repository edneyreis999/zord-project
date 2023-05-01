import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { ChapterModule } from './chapter/chapter.module';
import { ChapterService } from './chapter/chapter.service';
import { TextFileService } from './text-file/text-file.service';
import { Chapter, ChapterSchema } from './chapter/schemas/chapter.schema';
import { Arc, ArcSchema } from './schemas/arc';
import { Scene, SceneSchema } from './schemas/scene';
import { BookModule } from './book/book.module';
import { BookService } from './book/book.service';
import { Book, BookSchema } from './book/schemas/book.schema';
import { UniqueTitle } from './shared/validations/validation.title';
import { SetValidOrderConstraint } from './shared/validations/validation.order';
import { ConfigModule } from '@nestjs/config';
import { IsValidObjectIdAndExists } from './shared/validations/validation.objectId-exists';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
      },
    }),
    ConfigModule.forRoot(),
    ChapterModule,
    BookModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/zord'),
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: Chapter.name, schema: ChapterSchema },
      { name: Arc.name, schema: ArcSchema },
      { name: Scene.name, schema: SceneSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [
    ChapterService,
    TextFileService,
    BookService,
    UniqueTitle,
    IsValidObjectIdAndExists,
    SetValidOrderConstraint,
  ],
})
export class AppModule {}
