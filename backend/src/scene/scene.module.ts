import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SceneController } from './scene.controller';
import { SceneService } from './scene.service';
import { Scene, SceneSchema } from './schemas/scene.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Scene.name, schema: SceneSchema }]),
    // ClsService,
  ],
  controllers: [SceneController],
  providers: [SceneService],
})
export class SceneModule {}
