import { Module } from '@nestjs/common';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { TextFileService } from './text-file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from '../schemas/chapter';
import { Arc, ArcSchema } from 'src/schemas/arc';
import { Scene, SceneSchema } from 'src/schemas/scene';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chapter.name, schema: ChapterSchema },
      { name: Arc.name, schema: ArcSchema },
      { name: Scene.name, schema: SceneSchema },
    ]),
  ],
  controllers: [ChapterController],
  providers: [ChapterService, TextFileService],
})
export class ChapterModule {}
