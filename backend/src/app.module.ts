import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClsModule } from 'nestjs-cls';
import { AppController } from './app.controller';
import { Arc, ArcSchema } from './arc/schemas/arc';
import { BookModule } from './book/book.module';
import { Book, BookSchema } from './book/schemas/book.schema';
import { ChapterModule } from './chapter/chapter.module';
import { Chapter, ChapterSchema } from './chapter/schemas/chapter.schema';
import { Scene, SceneSchema } from './scene/schemas/scene';
import { TextFileService } from './text-file/text-file.service';

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
  providers: [TextFileService],
})
export class AppModule {}
