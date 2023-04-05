import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChapterModule } from './chapter/chapter.module';
import { ChapterService } from './chapter/chapter.service';
import { TextFileService } from './chapter/text-file.service';
import { Chapter, ChapterSchema } from './schemas/chapter';
import { Arc, ArcSchema } from './schemas/arc';
import { Scene, SceneSchema } from './schemas/scene';

@Module({
  imports: [
    ChapterModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/zord'),
    MongooseModule.forFeature([
      { name: Chapter.name, schema: ChapterSchema },
      { name: Arc.name, schema: ArcSchema },
      { name: Scene.name, schema: SceneSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, ChapterService, TextFileService],
})
export class AppModule {}
